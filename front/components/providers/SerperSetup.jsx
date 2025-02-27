import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ActionButton, Button } from "@app/components/Button";
import { useSWRConfig } from "swr";
import { checkProvider } from "@app/lib/providers";

export default function SerperSetup({ open, setOpen, config, enabled }) {
  const { mutate } = useSWRConfig();

  const [apiKey, setApiKey] = useState(config ? config.api_key : "");
  const [testSuccessful, setTestSuccessful] = useState(false);
  const [testRunning, setTestRunning] = useState(false);
  const [testError, setTestError] = useState("");
  const [enableRunning, setEnableRunning] = useState(false);

  if (config && config.api_key.length > 0 && apiKey.length == 0) {
    setApiKey(config.api_key);
  }

  const runTest = async () => {
    setTestRunning(true);
    setTestError("");
    let check = await checkProvider("serper", { api_key: apiKey });

    if (!check.ok) {
      setTestError(check.error);
      setTestSuccessful(false);
      setTestRunning(false);
    } else {
      setTestError("");
      setTestSuccessful(true);
      setTestRunning(false);
    }
  };

  const handleEnable = async () => {
    setEnableRunning(true);
    let res = await fetch(`/api/providers/serper`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        config: JSON.stringify({
          api_key: apiKey,
        }),
      }),
    });
    setEnableRunning(false);
    mutate(`/api/providers`);
    setOpen(false);
  };

  const handleDisable = async () => {
    let res = await fetch(`/api/providers/serper`, {
      method: "DELETE",
    });
    mutate(`/api/providers`);
    setOpen(false);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 transition-opacity bg-gray-800 bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center items-end justify-center min-h-full p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              leave="ease-in duration-200"
              leaveTo="opacity-0"
            >
              <Dialog.Panel className="relative px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-sm lg:max-w-lg sm:p-6">
                <div>
                  <div className="mt-3">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Setup Serper Search
                    </Dialog.Title>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        Serper lets you search Google (and other search
                        engines). To use Serper you must provide your API key.
                        It can be found{" "}
                        <a
                          className="font-bold text-violet-600 hover:text-violet-500"
                          href="https://serper.dev/api-key"
                          target="_blank"
                        >
                          here
                        </a>
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        We'll never use your API key for anything other than to
                        run your apps.
                      </p>
                    </div>
                    <div className="mt-6">
                      <input
                        type="text"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                        placeholder="Serper API Key"
                        value={apiKey}
                        onChange={(e) => {
                          setApiKey(e.target.value);
                          setTestSuccessful(false);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="px-2 mt-1 text-sm">
                  {testError.length > 0 ? (
                    <span className="text-red-500">Error: {testError}</span>
                  ) : testSuccessful ? (
                    <span className="text-green-600">
                      Test succeeded! You can enable Serper Search.
                    </span>
                  ) : (
                    <span>&nbsp;</span>
                  )}
                </div>
                <div className="flex flex-row items-center mt-5 space-x-2 sm:mt-6">
                  {enabled ? (
                    <div
                      className="flex-initial text-sm font-bold text-red-500 cursor-pointer"
                      onClick={() => handleDisable()}
                    >
                      Disable
                    </div>
                  ) : (
                    <></>
                  )}
                  <div className="flex-1"></div>
                  <div className="flex flex-initial">
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                  </div>
                  <div className="flex flex-initial">
                    {testSuccessful ? (
                      <ActionButton
                        onClick={() => handleEnable()}
                        disabled={enableRunning}
                      >
                        {enabled
                          ? enableRunning
                            ? "Updating..."
                            : "Update"
                          : enableRunning
                          ? "Enabling..."
                          : "Enable"}
                      </ActionButton>
                    ) : (
                      <ActionButton
                        disabled={apiKey.length == 0 || testRunning}
                        onClick={() => runTest()}
                      >
                        {testRunning ? "Testing..." : "Test"}
                      </ActionButton>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
