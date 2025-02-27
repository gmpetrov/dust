import Head from "next/head";
import Script from "next/script";
import { ActionButton, HighlightButton } from "@app/components/Button";
import { Logo } from "@app/components/Logo";
import Link from "next/link";
import { useEffect, useState } from "react";

const {
  GA_TRACKING_ID = null,
  XP1_CHROME_WEB_STORE_URL,
} = process.env;

export default function Home({
  ga_tracking_id,
  chrome_web_store_url,
}) {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    const platform =
      typeof window !== "undefined" ? window.navigator.platform : "";
    var isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(platform);
    setIsMac(isMacLike);
  }, []);

  return (
    <>
      <Head>
        <title>Dust - XP1</title>
        <link rel="shortcut icon" href="/static/favicon.png" />
        <meta name="twitter:card" content="summary_large_image"></meta>
        <meta name="twitter:site" content="@dust4ai"></meta>
        <meta name="twitter:title" content="Dust XP1"></meta>
        <meta
          name="twitter:description"
          content="Productivity Assistant with access to your Tabs"
        ></meta>
        <meta
          name="twitter:image"
          content="https://storage.googleapis.com/dust-xp1-extension/gifs/dust-xp1-screenshot.png"
        ></meta>
      </Head>

      <main className="mx-4">
        <div className="mx-8">
          <Logo />
        </div>

        <div className="mx-auto mt-12">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 text-center">
            <span className="text-gray-800">
              <div className="leading-snug">
                <span className="text-violet-600">Productivity Assistant</span>
              </div>
              <div>with access to your Tabs</div>
            </span>{" "}
          </h1>
        </div>

        <div className="w-full mt-16">
          <div className="w-[300px] h-[165px] sm:w-[670px] sm:h-[375px] mx-auto overflow-hidden rounded-md border border-gray-300">
            <img src="https://storage.googleapis.com/dust-xp1-extension/gifs/dust-xp1-bundled.gif"></img>
          </div>
        </div>

        <div className="mt-16">
          <div className="flex flex-row items-center">
            <div className="flex flex-row mx-auto">
              <div className="flex ml-2">
                <div className="">
                  <a href={chrome_web_store_url} target="_blank">
                    <HighlightButton>Install Extension</HighlightButton>
                  </a>
                </div>
              </div>

              <div className="flex ml-2">
                <div className="">
                  <div className="text-center">
                    <div className="">
                      <Link href="/xp1/activate">
                        <ActionButton>Get Activation Key</ActionButton>
                      </Link>
                    </div>
                  </div>
                  <div className="text-gray-400 text-xs mt-1 text-center">
                    <span className="text-gray-600">
                      Free - no cards required
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 my-8 leading-16">
          <div className="text-gray-900 text-sm max-w-2xl mx-auto">
            <div className="bg-gray-800 text-gray-200 rounded-t py-2 px-3">
              User guide
            </div>
            <div className="py-2 pl-3 pr-1 bg-gray-700 text-white rounded-b">
              <p className="mb-4">
                <b>XP1</b> is an assistant based on GPT (gpt-3.5-turbo) with
                access to your browser tabs content. It is geared (prompted)
                towards productivity and can be used to help you with your daily
                tasks (such as answering emails, summarizing documents,
                extracting structured data from unstructured text, ...)
              </p>
              <ul className="my-4">
                <li>
                  - Use
                  <span className="font-bold font-mono text-gray-300 mx-1">
                    {isMac ? "⌘" : "Ctrl"}
                    +↑
                  </span>
                  to open the assistant (remap by visiting{" "}
                  <span className="font-bold text-gray-300">
                    chrome://extensions/shortcuts
                  </span>
                  ).
                </li>
                <li>
                  - Use{" "}
                  <span className="font-bold font-mono text-gray-300 mx-1">
                    `[[`
                  </span>{" "}
                  to select tabs content to include in the context of your
                  query.
                </li>
                <li>
                  - Use
                  <span className="font-bold font-mono text-gray-300 mx-1">
                    {isMac ? "⌘" : "Ctrl"}
                    +⏎
                  </span>
                  to submit your query.
                </li>
                <li>
                  - Use
                  <span className="font-bold font-mono text-gray-300 mx-1">
                    /reset
                  </span>
                  to clear the conversation.
                </li>
              </ul>
              <p className="my-2 mt-6 font-bold"># Example usage</p>
              <p className="my-1 mx-2 italic font-bold text-gray-300">
                Reply to [[email]] based on [[knowledgebase]]
              </p>
              <p className="my-1 mx-2 italic font-bold text-gray-300">
                Summarize with bullet-points [[cnn]]
              </p>
              <p className="my-1 mx-2 italic font-bold text-gray-300">
                Extract [[linkedin]] experience as CSV
              </p>
              <p className="my-1 mx-2 italic font-bold text-gray-300">
                Generate a twitter thread with emoji to sell [[product]]
              </p>
              <p className="my-1 mx-2 italic font-bold text-gray-300">
                Generate a 5 sentence bio about [[linkedin]]
              </p>
              <p className="my-1 mx-2 italic font-bold text-gray-300">
                Generate a personalized email to [[linkedin]] offering to try
                [[xp1]]
              </p>
              <p className="my-1 mx-2 italic font-bold text-gray-300">
                JSON from [[email]] and [[linkedin]] of the form {"{"}name,
                email, job_title, feedback, date {"}"}
              </p>
              <p className="mt-6 mb-2 font-bold"># Known Limitations</p>
              <ul className="my-2">
                <li>
                  - Does not work with Google Docs and Google Sheets (work in
                  progress)
                </li>
                <li>
                  - Model context size can be a limitation for long documents
                  especially when using multiple tabs
                </li>
              </ul>
              <p className="mt-6 mb-2 font-bold"># Privacy</p>
              <p className="my-2">
                Only the text content of the tabs you select and submit are sent
                through our servers to OpenAI's API. Cookies, tab list, or
                non-submitted tab content are never sent.
              </p>
              <p className="mt-6 mb-2 font-bold"># Support</p>
              <ul className="my-2">
                <li>
                  - Email <a href="mailto:team@dust.tt">team@dust.tt</a>
                </li>
                <li>
                  - #xp1 on{" "}
                  <a href="https://discord.gg/VHAcSBMVj6">
                    discord.gg/VHAcSBMVj6
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga_tracking_id}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
             window.dataLayer = window.dataLayer || [];
             function gtag(){window.dataLayer.push(arguments);}
             gtag('js', new Date());

             gtag('config', '${ga_tracking_id}');
            `}
          </Script>
        </>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      ga_tracking_id: GA_TRACKING_ID,
      chrome_web_store_url: XP1_CHROME_WEB_STORE_URL,
    },
  };
}
