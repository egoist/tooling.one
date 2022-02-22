import Link from "next/link"
import { Layout } from "../components/Layout"
import { tools } from "~/tools"

export default function HomePage() {
  return (
    <Layout>
      <div className="p-5 max-w-screen-lg">
        <a
          target="_blank"
          rel="noopener nofollow"
          href="https://github.com/sponsors/egoist"
          className="mb-5 border-2 border-pink-400 text-pink-500 font-bold flex items-center justify-center p-5 rounded-lg text-xl space-x-2 hover:bg-pink-50"
        >
            <img
            alt="github sponsors logo"
            src="/github-sponsors-logo.svg"
            className="w-1- h-10"
          />
          <span>Sponsor this project on GitHub.</span>
        </a>
        <div className="bg-cyan-100 text-cyan-700 font-bold p-5 rounded-lg space-y-3">
          <p>
            tooling.one is a collection of useful tools for developers, it works
            locally mostly, no data will be uploaded to any server unless
            otherwise noted.
          </p>
          <p className="">
            I'm keeping adding new tools to this website, you can also suggest
            ideas on{" "}
            <a
              href="https://github.com/egoist/tooling.one/issues"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-5 p-5 max-w-screen-lg">
        {tools.map((tool) => {
          return (
            <Link href={tool.link} key={tool.name}>
              <a className="border rounded-lg p-5 font-bold hover:bg-zinc-100">
                {tool.name}
              </a>
            </Link>
          )
        })}
      </div>
    </Layout>
  )
}
