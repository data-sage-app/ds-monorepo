import { useState, type ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  CreateOrganization,
  useOrganization,
  useOrganizationList,
} from "@clerk/nextjs";
import {
  type OrganizationMembershipResource,
  type OrganizationResource,
  type SetActive,
} from "@clerk/types";
import { Button, Card, Flex, Grid, Text, Title } from "@tremor/react";

type StoreCardProps = {
  organization: {
    membership: OrganizationMembershipResource;
    organization: OrganizationResource;
  };
  setActive: SetActive;
  isActive: boolean;
};

type ModalContentProps = {
  children: ReactNode;
  onClose: () => void;
};

export default function Stores() {
  const { organization: org, isLoaded: isLoadedOrg } = useOrganization();
  const {
    isLoaded: isLoadedList,
    organizationList,
    setActive,
  } = useOrganizationList();
  const [showModal, setShowModal] = useState(false);

  return (
    <main className="m-8">
      <Flex justifyContent="between">
        <div>
          <Title>Stores</Title>
          <Text>
            This is a list of all the stores you have access to. Click on a
            store to view it.
          </Text>
        </div>
        {isLoadedOrg && isLoadedList && (
          <Button onClick={() => setShowModal(true)}>Create Store</Button>
        )}
      </Flex>
      {isLoadedList && isLoadedOrg && (
        <>
          <Grid numItemsMd={3} numItemsSm={2} className="mt-6 gap-6">
            {organizationList.map((organization) => (
              <StoreCard
                key={organization.organization.id}
                organization={organization}
                setActive={setActive}
                isActive={organization.organization.id === org?.id}
              />
            ))}
          </Grid>
          {showModal && (
            <ModalContent onClose={() => setShowModal(false)}>
              <CreateOrganization afterCreateOrganizationUrl="/stores" />
            </ModalContent>
          )}
        </>
      )}
    </main>
  );
}

const ModalContent: React.FC<ModalContentProps> = ({ children, onClose }) => {
  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none"
        onClick={onClose}
      >
        <div
          className="relative mx-auto my-6 w-auto max-w-3xl"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  );
};

const StoreCard: React.FC<StoreCardProps> = ({ organization, setActive }) => {
  const router = useRouter();

  const handleOrganizationClick = () => {
    const executeAsyncOperation = async () => {
      console.log("clicked");
      try {
        await setActive({ organization: organization.organization });
        void router.push(`/stores/${organization.organization.slug}/overview`);
      } catch (error) {
        console.error("Error setting active organization:", error);
      }
    };

    executeAsyncOperation().catch((error) => {
      // Handle any unhandled promise rejections
      console.error("Error in handleOrganizationClick:", error);
    });
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleOrganizationClick}
      onKeyDown={handleOrganizationClick}
    >
      <Card
        key={organization.organization.id}
        className="flex h-44 cursor-pointer items-center justify-center rounded-xl border border-neutral-600"
      >
        <div className="flex items-center gap-x-4">
          <Image
            src={organization.organization.imageUrl}
            width={48}
            height={48}
            alt={organization.organization.name}
            className="flex-none rounded-lg object-cover"
          />
          <Text className="text-xl font-medium leading-6 text-neutral-100">
            {organization.organization.name}
          </Text>
        </div>
      </Card>
    </div>
  );
};
