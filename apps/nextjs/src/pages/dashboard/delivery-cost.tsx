import { on } from "events";
import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckCircleIcon, CurrencyDollarIcon } from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Callout,
  Card,
  Flex,
  Metric,
  NumberInput,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
  TextInput,
  Title,
} from "@tremor/react";
import {
  useForm,
  type Control,
  type FormState,
  type UseFormHandleSubmit,
  type UseFormRegister,
  type UseFormReturn,
} from "react-hook-form";

import {
  createCostOfDeliveryInput,
  selectCostOfDeliveryInput,
} from "@acme/api/src/schemas/costOfDeliverySchemas";

import { api, type RouterInputs } from "~/utils/api";
import { currencyFormatter } from "~/utils/formatters";
import DashboardLayout from "~/components/layouts/dashboard";

type CreateDeliveryCost =
  RouterInputs["costOfDelivery"]["createCostOfDelivery"];

type UpdateDeliveryCost =
  RouterInputs["costOfDelivery"]["updateCostOfDelivery"];

type DeleteDeliveryCost =
  RouterInputs["costOfDelivery"]["deleteCostOfDelivery"];

type CreateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDeliveryCost) => void;
  formState: FormState<CreateDeliveryCost>;
  register: UseFormRegister<CreateDeliveryCost>;
  control: Control<CreateDeliveryCost>;
  handleSubmit: UseFormHandleSubmit<CreateDeliveryCost>;
};

type UpdateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpdateSubmit: (data: UpdateDeliveryCost) => void;
  onDeleteSubmit: (data: DeleteDeliveryCost) => void;
  selectedCostId: number | null;
  formState: FormState<UpdateDeliveryCost>;
  register: UseFormRegister<UpdateDeliveryCost>;
  control: Control<UpdateDeliveryCost>;
  handleSubmit: UseFormHandleSubmit<UpdateDeliveryCost>;
};

export default function DeliveryCosts() {
  const [showCreateDeliveryCostModal, setShowCreateDeliveryCostModal] =
    useState(false);
  const [showUpdateDeliveryCostModal, setShowUpdateDeliveryCostModal] =
    useState(false);

  const [selectedCostId, setSelectedCostId] = useState<number | null>(null);

  const costsOfDelivery = api.costOfDelivery.getCostOfDelivery.useQuery();
  const totalCostOfDelivery =
    api.costOfDelivery.getTotalCostOfDelivery.useQuery();

  const createForm: UseFormReturn<CreateDeliveryCost> = useForm({
    resolver: zodResolver(createCostOfDeliveryInput),
  });

  const updateForm: UseFormReturn<UpdateDeliveryCost> = useForm({
    resolver: zodResolver(selectCostOfDeliveryInput),
  });

  const createCostMutation =
    api.costOfDelivery.createCostOfDelivery.useMutation<CreateDeliveryCost>({
      onSuccess: () => {
        setShowCreateDeliveryCostModal(false);
        void costsOfDelivery.refetch();
        void totalCostOfDelivery.refetch();
      },
    });

  const updateCostMutation =
    api.costOfDelivery.updateCostOfDelivery.useMutation<UpdateDeliveryCost>({
      onSuccess: () => {
        setShowUpdateDeliveryCostModal(false);
        void costsOfDelivery.refetch();
        void totalCostOfDelivery.refetch();
      },
    });

  const deleteCostMutation =
    api.costOfDelivery.deleteCostOfDelivery.useMutation<DeleteDeliveryCost>({
      onSuccess: () => {
        setShowUpdateDeliveryCostModal(false);
        void costsOfDelivery.refetch();
        void totalCostOfDelivery.refetch();
      },
    });

  // Create a Cost of Delivery
  async function CreateCostOfDelivery(data: CreateDeliveryCost) {
    try {
      await createCostMutation.mutateAsync({
        name: data.name,
        value: data.value,
      });
    } catch (error) {
      console.log(error);
    }
  }

  // Update a Cost of Delivery
  async function UpdateCostOfDelivery(data: UpdateDeliveryCost) {
    try {
      await updateCostMutation.mutateAsync({
        id: data.id,
        name: data.name,
        value: data.value,
      });
    } catch (error) {
      console.log(error);
    }
  }

  // Delete a Cost of Delivery
  async function DeleteCostOfDelivery(date: DeleteDeliveryCost) {
    try {
      await deleteCostMutation.mutateAsync({
        id: date.id,
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <DashboardLayout>
      <Card>
        <Flex justifyContent="between" alignItems="end">
          <div>
            <Title className="mt-1">Cost Of Delivery</Title>
            <Flex justifyContent="start" alignItems="baseline">
              <Metric>
                {totalCostOfDelivery.data?._sum.value &&
                  currencyFormatter(totalCostOfDelivery.data?._sum.value)}
                {}
              </Metric>
              <Text className="ml-2"> / Month</Text>
            </Flex>

            <Callout
              className="mt-6"
              title="Usual amount of Costs"
              icon={CheckCircleIcon}
              color="emerald"
            >
              This is a list of all of your costs of delivery. Click on a cost
              of delivery to view it.
            </Callout>
          </div>
          <Button
            variant="secondary"
            onClick={() => setShowCreateDeliveryCostModal(true)}
          >
            Add Cost
          </Button>
        </Flex>

        <Table className="mt-6">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>

              <TableHeaderCell className="text-right">Amount</TableHeaderCell>
              <TableHeaderCell></TableHeaderCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {costsOfDelivery.data?.map((item) => (
              <TableRow key={item.name}>
                <TableCell>{item.name}</TableCell>

                <TableCell className="text-right">
                  {currencyFormatter(item.value)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="xs"
                    variant="light"
                    color="lime"
                    onClick={() => {
                      setSelectedCostId(item.id);
                      setShowUpdateDeliveryCostModal(true);
                      console.log(item.id);
                    }}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {showCreateDeliveryCostModal && (
        <CreateDeliveryCostModal
          isOpen={showCreateDeliveryCostModal}
          onClose={() => setShowCreateDeliveryCostModal(false)}
          onSubmit={(data) => {
            void CreateCostOfDelivery(data);
          }}
          formState={createForm.formState}
          register={createForm.register}
          control={createForm.control}
          handleSubmit={createForm.handleSubmit}
        />
      )}

      {showUpdateDeliveryCostModal && (
        <UpdateDeliveryCostModal
          isOpen={showUpdateDeliveryCostModal}
          onClose={() => setShowUpdateDeliveryCostModal(false)}
          onUpdateSubmit={(data) => {
            void UpdateCostOfDelivery(data);
          }}
          onDeleteSubmit={(data) => {
            void DeleteCostOfDelivery(data);
          }}
          selectedCostId={selectedCostId}
          formState={updateForm.formState}
          register={updateForm.register}
          control={updateForm.control}
          handleSubmit={updateForm.handleSubmit}
        />
      )}
    </DashboardLayout>
  );
}

/**
 * CreateDeliveryCostModal Component
 *
 * This component displays a modal that allows users to create
 * a cost of delivery. Form validation is done using react-hook-form and zod.
 */
function CreateDeliveryCostModal({
  isOpen,
  onClose,
  onSubmit,
  formState,
  register,
  handleSubmit,
}: CreateModalProps) {
  function handleFormSubmit(e: React.FormEvent) {
    console.log("worked");
    e.preventDefault();

    handleSubmit(onSubmit)().catch((error) => {
      console.error("Form submission error:", error);
    });
  }
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-neutral-900 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <form onSubmit={handleFormSubmit}>
                  <div>
                    <Text>Name</Text>
                    {formState.errors.name?.message ? (
                      <TextInput
                        className="mt-1"
                        {...register("name")}
                        error={true}
                        errorMessage={formState.errors.name?.message}
                      />
                    ) : (
                      <TextInput
                        className="mt-1"
                        {...register("name")}
                        error={false}
                      />
                    )}

                    <Text className="mt-4">Amount</Text>
                    {formState.errors.value?.message ? (
                      <NumberInput
                        icon={CurrencyDollarIcon}
                        defaultValue={0}
                        className="mt-1"
                        {...register("value", {
                          setValueAs: (value) => parseFloat(value as string),
                        })}
                        error={true}
                        errorMessage={formState.errors.value?.message}
                      />
                    ) : (
                      <NumberInput
                        icon={CurrencyDollarIcon}
                        defaultValue={0}
                        className="mt-1"
                        {...register("value", {
                          setValueAs: (value) => parseFloat(value as string),
                        })}
                        error={false}
                      />
                    )}
                  </div>
                  <div className="mt-5 sm:mt-6">
                    <Button
                      variant="primary"
                      type="submit"
                      className="w-full"
                      disabled={formState.isSubmitting}
                      loading={formState.isLoading}
                    >
                      Add Cost
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

function UpdateDeliveryCostModal({
  isOpen,
  onClose,
  selectedCostId,
  onUpdateSubmit,
  onDeleteSubmit,
  formState,
  register,
  handleSubmit,
}: UpdateModalProps) {
  function updateFormSubmit(e: React.FormEvent) {
    handleSubmit(onUpdateSubmit)().catch((error) => {
      console.error("Form submission error:", error);
    });
    e.preventDefault();
  }

  if (selectedCostId === null) {
    return null;
  } else {
    return (
      <div>
        {selectedCostId && (
          <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
              </Transition.Child>

              <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  >
                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-neutral-900 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                      <form onSubmit={updateFormSubmit}>
                        <div>
                          <Text>Name</Text>
                          {formState.errors.name?.message ? (
                            <TextInput
                              className="mt-1"
                              {...register("name")}
                              error={true}
                              errorMessage={formState.errors.name?.message}
                            />
                          ) : (
                            <TextInput
                              className="mt-1"
                              {...register("name")}
                              error={false}
                            />
                          )}

                          <Text className="mt-4">Amount</Text>
                          {formState.errors.value?.message ? (
                            <NumberInput
                              defaultValue={0}
                              icon={CurrencyDollarIcon}
                              className="mt-1"
                              {...register("value", {
                                setValueAs: (value) =>
                                  parseFloat(value as string),
                              })}
                              error={true}
                              errorMessage={formState.errors.value?.message}
                            />
                          ) : (
                            <NumberInput
                              defaultValue={0}
                              icon={CurrencyDollarIcon}
                              className="mt-1"
                              {...register("value", {
                                setValueAs: (value) =>
                                  parseFloat(value as string),
                              })}
                              error={false}
                            />
                          )}
                        </div>

                        <input
                          type="hidden"
                          {...register("id", {
                            setValueAs: (id) => parseInt(id as string),
                          })}
                          value={selectedCostId}
                        />
                        <div className="my-5 sm:my-6">
                          <Button
                            variant="primary"
                            type="submit"
                            className="w-full"
                            disabled={formState.isSubmitting}
                            loading={formState.isLoading}
                          >
                            Update Cost
                          </Button>
                        </div>

                        <Button
                          variant="primary"
                          type="button"
                          className="w-full border-red-600 bg-red-600 text-neutral-100 hover:border-red-700 hover:bg-red-700"
                          disabled={formState.isSubmitting}
                          loading={formState.isLoading}
                          onClick={() => {
                            onDeleteSubmit({ id: selectedCostId });
                          }}
                        >
                          Delete Cost
                        </Button>
                      </form>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition.Root>
        )}
      </div>
    );
  }
}
