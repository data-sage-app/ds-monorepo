import { NextApiRequest, NextApiResponse } from "next";
import type {
  WebhookEvent,
  UserJSON,
  OrganizationJSON,
  OrganizationMembershipJSON,
  SessionJSON,
} from "@clerk/clerk-sdk-node";
import {
  User,
  Organization,
  OrganizationMembership,
  Session,
} from "@clerk/clerk-sdk-node";
import clerk from "@clerk/clerk-sdk-node";
import { Webhook, WebhookRequiredHeaders } from "svix";
import { buffer } from "micro";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const secret = process.env.CLERK_WEBHOOK_SIGNING_KEY;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const payload = (await buffer(req)).toString();
  const headers: WebhookRequiredHeaders = {
    "svix-id": req.headers["svix-id"] as string,
    "svix-signature": req.headers["svix-signature"] as string,
    "svix-timestamp": req.headers["svix-timestamp"] as string,
  };

  if (!secret) {
    res.status(500).json({ error: "CLERK_WEBHOOK_SIGNING_KEY not set" });
    return;
  }

  const wh = new Webhook(secret);

  let evt: WebhookEvent | undefined;

  try {
    evt = wh.verify(payload, headers) as WebhookEvent;
  } catch (err) {
    res.status(400).json({});
  }

  if (evt) {
    if (["user.created", "user.updated"].includes(evt.type)) {
      const userJson = evt.data as UserJSON;
      const user = User.fromJSON(userJson);
      await userUpsert({ user });
    }
    if (["user.deleted"].includes(evt.type)) {
      const userJson = evt.data as UserJSON;
      const user = User.fromJSON(userJson);
      await userDelete({ user });
    }
    if (["organization.created", "organization.updated"].includes(evt.type)) {
      const organizationJson = evt.data as OrganizationJSON;
      const organization = Organization.fromJSON(organizationJson);
      await organizationUpsert({ organization });
    }
    if (["organization.deleted"].includes(evt.type)) {
      const organizationJson = evt.data as OrganizationJSON;
      const organization = Organization.fromJSON(organizationJson);
      await organizationDelete({ organization });
    }
    if (
      [
        "organizationMembership.created",
        "organizationMembership.updated",
      ].includes(evt.type)
    ) {
      const organizationMembershipJson = evt.data as OrganizationMembershipJSON;
      const organizationMembership = OrganizationMembership.fromJSON(
        organizationMembershipJson,
      );
      await organizationMembershipUpsert({ organizationMembership });
    }
    if (["organizationMembership.deleted"].includes(evt.type)) {
      const organizationMembershipJson = evt.data as OrganizationMembershipJSON;
      const organizationMembership = OrganizationMembership.fromJSON(
        organizationMembershipJson,
      );
      await organizationMembershipDelete({ organizationMembership });
    }
    if (["session.created", "session.updated"].includes(evt.type)) {
      const sessionJson = evt.data as SessionJSON;
      const session = Session.fromJSON(sessionJson);
      await syncSession({ session });
    }
  }

  res.status(200).json({ ok: true });
}

async function userUpsert({ user }: { user: User }) {
  await prisma.user.upsert({
    where: {
      id: user.id,
    },
    update: {
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
    },
    create: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
    },
  });
}

async function userDelete({ user }: { user: User }) {
  try {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        softDeleted: true,
        softDeletedAt: new Date(),
      },
    });
  } catch (e) {
    console.log("Soft delete failed, user not found");
  }
}

async function organizationUpsert({
  organization,
}: {
  organization: Organization;
}) {
  await prisma.organization.upsert({
    where: {
      id: organization.id,
    },
    update: {
      name: organization.name,
      imageUrl: organization.imageUrl,
    },
    create: {
      id: organization.id,
    },
  });
}

async function organizationDelete({
  organization,
}: {
  organization: Organization;
}) {
  try {
    await prisma.organization.update({
      where: {
        id: organization.id,
      },
      data: {
        softDeleted: true,
        softDeletedAt: new Date(),
      },
    });
  } catch (e) {
    console.log("Soft delete failed, organization not found");
  }
}

async function organizationMembershipUpsert({
  organizationMembership,
}: {
  organizationMembership: OrganizationMembership;
}) {
  const clerkUser = await clerk.users.getUser(
    organizationMembership.publicUserData?.userId!,
  );

  const clerkOrganization = await clerk.organizations.getOrganization({
    organizationId: organizationMembership.organization.id,
  });

  await userUpsert({ user: clerkUser });
  await organizationUpsert({ organization: clerkOrganization });

  await prisma.organizationMembership.upsert({
    where: {
      id: organizationMembership.id,
    },
    update: {
      userId: clerkUser.id,
      organizationId: clerkOrganization.id,
    },
    create: {
      id: organizationMembership.id,
      userId: clerkUser.id,
      organizationId: clerkOrganization.id,
    },
  });
}

async function organizationMembershipDelete({
  organizationMembership,
}: {
  organizationMembership: OrganizationMembership;
}) {
  try {
    await prisma.organizationMembership.update({
      where: {
        id: organizationMembership.id,
      },
      data: {
        softDeleted: true,
        softDeletedAt: new Date(),
      },
    });
  } catch (e) {
    console.log("Soft delete failed, organization membership not found");
  }
}

async function syncSession({ session }: { session: Session }) {
  let dbUser = await prisma.user.findFirst({
    where: {
      id: session.userId,
    },
  });

  // get users organization memberships

  if (!dbUser) {
    const user = await clerk.users.getUser(session.userId);
    await userUpsert({ user });
    dbUser = await prisma.user.findFirst({
      where: {
        id: session.userId,
      },
    });
  }

  const organizations = await clerk.users.getOrganizationMembershipList({
    userId: dbUser!.id,
  });

  for (const org of organizations) {
    let dbOrganization = await prisma.organization.findFirst({
      where: {
        id: org.organization.id,
      },
    });

    if (!dbOrganization) {
      const organization = await clerk.organizations.getOrganization({
        organizationId: org.organization.id,
      });
      await organizationUpsert({ organization });
      dbOrganization = await prisma.organization.findFirst({
        where: {
          id: org.organization.id,
        },
      });
    }

    if (dbUser && dbOrganization) {
      const organizationMembership =
        await clerk.organizations.getOrganizationMembershipList({
          organizationId: dbOrganization.id,
        });

      if (organizationMembership.length > 0) {
        const organizationMembershipThisUser = organizationMembership.find(
          (om) => om.publicUserData?.userId === dbUser!.id,
        );

        if (organizationMembershipThisUser) {
          await organizationMembershipUpsert({
            organizationMembership: organizationMembershipThisUser,
          });
        }
      }
    }
  }
}
