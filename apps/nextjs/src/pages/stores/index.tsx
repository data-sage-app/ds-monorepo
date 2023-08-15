import { CreateOrganization, useOrganizationList, useOrganization } from "@clerk/nextjs";
import DashboardLayout from "../../components/layouts/dashboard";
import { Button } from "@tremor/react";
import { useState } from "react";
import { OrganizationMembershipResource, OrganizationResource, SetActive } from "@clerk/types";
import { useRouter } from "next/router";


function Store( { organization, setActive, isActive } : { organization: {
  membership: OrganizationMembershipResource;
  organization: OrganizationResource;
}, setActive: SetActive, isActive: boolean}) {
  const router = useRouter();

  return (
    <div className={`border p-2 rounded-md ${isActive ? "bg-lime-200 text-black" : ""}`}
      onClick={() => {
        setActive({organization: organization.organization}).then(() => {
          router.push(`/stores/${organization.organization.slug}/overview`)
        })
      
      }}
    >
      <div className="flex flex-row justify-center w-96">
        {organization.organization.name}
      </div>
    </div>
  )
}

export default function Stores() {
  const {organization: org, isLoaded: isLoadedOrg} = useOrganization();

  const { 
    isLoaded: isLoadedList,
    organizationList,
    createOrganization,
    setActive
  } = useOrganizationList()

  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div className="container mx-auto">
        <div className="flex flex-row justify-center pt-8">
          <div className="flex flex-col space-y-2">
            <div className="text-2xl text-center">
              Pick a Store
            </div>
            {isLoadedList && isLoadedOrg && organizationList.map((organization) => (
              <Store organization={organization} setActive={setActive} isActive={organization.organization.id === org?.id || false} />
            ))}
            {isLoadedList && isLoadedOrg && organizationList.length === 0 && (
              <div className="text-lg">
                You don't have any stores yet.
              </div>
            )}
            {isLoadedList && isLoadedOrg && (
              <Button
                onClick={() => {
                  setShowModal(true)
                }}
              >
                Create Organization
              </Button>
            )}
          </div>
        </div>
      </div>
      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            onClick={() => setShowModal(false)}
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl"
              onClick={e => e.stopPropagation()}
            >
              {/*content*/}
              <CreateOrganization
                afterCreateOrganizationUrl="/stores"
              />
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div>
  );
}
