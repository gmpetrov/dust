import AppLayout from "@app/components/AppLayout";
import MainTab from "@app/components/app/MainTab";
import { ActionButton } from "@app/components/Button";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "@app/pages/api/auth/[...nextauth]";
import { PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { classNames } from "@app/lib/utils";
import Router from "next/router";

const { URL, GA_TRACKING_ID = null } = process.env;

export default function DatasetsView({
  app,
  datasets,
  user,
  readOnly,
  ga_tracking_id,
}) {
  const { data: session } = useSession();

  const handleDelete = async (datasetName) => {
    if (confirm("Are you sure you want to delete this dataset entirely?")) {
      const res = await fetch(
        `/api/apps/${session.user.username}/${app.sId}/datasets/${datasetName}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      Router.push(`/${session.user.username}/a/${app.sId}/datasets`);
    }
  };

  return (
    <AppLayout
      app={{ sId: app.sId, name: app.name, description: app.description }}
      ga_tracking_id={ga_tracking_id}
    >
      <div className="leadingflex flex-col">
        <div className="flex flex-initial mt-2">
          <MainTab
            app={{ sId: app.sId, name: app.name }}
            currentTab="Datasets"
            user={user}
            readOnly={readOnly}
          />
        </div>
        <div className="w-full max-w-5xl mt-4 mx-auto">
          <div className="flex flex-1">
            <div className="flex flex-auto flex-col mx-2 sm:mx-4 lg:mx-8 my-4">
              <Link href={`/${user}/a/${app.sId}/datasets/new`}>
                <ActionButton disabled={readOnly}>
                  <PlusIcon className="-ml-1 mr-1 h-5 w-5 mt-0.5" />
                  New Dataset
                </ActionButton>
              </Link>

              <div className="mt-4">
                <ul role="list" className="space-y-4 flex-1">
                  {datasets.map((d) => {
                    return (
                      <Link
                        key={d.name}
                        href={`/${user}/a/${app.sId}/datasets/${d.name}`}
                        className="block"
                      >
                        <div
                          key={d.name}
                          className="group px-4 py-4 rounded border border-gray-300"
                        >
                          <div className="flex items-center justify-between">
                            <p className="truncate text-base font-bold text-violet-600">
                              {d.name}
                            </p>
                            {readOnly ? null : (
                              <div className="ml-2 flex flex-shrink-0">
                                <TrashIcon
                                  className="h-4 w-4 hidden group-hover:block text-gray-400 hover:text-red-700"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDelete(d.name);
                                  }}
                                />
                              </div>
                            )}
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p
                                className={classNames(
                                  d.description
                                    ? "text-gray-700"
                                    : "text-gray-300",
                                  "flex items-center text-sm text-gray-700"
                                )}
                              >
                                {d.description
                                  ? d.description
                                  : "No description"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </ul>
                <div className="px-2 max-w-4xl mt-2">
                  <div className="text-sm text-gray-400 py-2">
                    Datasets are used as input data to apps (
                    <span className="rounded-md px-1 py-0.5 bg-gray-200 font-bold">
                      input
                    </span>{" "}
                    block) or few-shot examples to prompt models (
                    <span className="rounded-md px-1 py-0.5 bg-gray-200 font-bold">
                      data
                    </span>{" "}
                    block).
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  let readOnly = !session || context.query.user !== session.user.username;

  const [appRes, datasetsRes] = await Promise.all([
    fetch(`${URL}/api/apps/${context.query.user}/${context.query.sId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: context.req.headers.cookie,
      },
    }),
    fetch(
      `${URL}/api/apps/${context.query.user}/${context.query.sId}/datasets`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: context.req.headers.cookie,
        },
      }
    ),
  ]);

  if (appRes.status === 404) {
    return {
      notFound: true,
    };
  }

  const [app, datasets] = await Promise.all([
    appRes.json(),
    datasetsRes.json(),
  ]);

  return {
    props: {
      session,
      app: app.app,
      datasets: datasets.datasets,
      readOnly,
      user: context.query.user,
      ga_tracking_id: GA_TRACKING_ID,
    },
  };
}
