import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-80s-white">
      <div className="flex-1 p-4 sm:p-8 md:p-16 lg:p-20">
        <div className="max-w-screen-md mx-auto">
          {/* Hero Section */}
          <section id="about" className="mb-16">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="relative rounded-full overflow-hidden w-80 md:w-96 lg:w-[500px] aspect-square shadow-[0_0_20px_hsl(var(--80s-cyan))]">
                <Image
                  alt="JSON"
                  className="object-cover"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 33vw"
                  src="/profile.jpeg"
                />
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-80s-cyan drop-shadow-[0_0_8px_hsl(var(--80s-cyan))] mb-4">
                  Jason Seegmiller
                </h1>
                <p className="text-lg text-80s-yellow mb-4">
                  Principal Developer at Shed
                </p>
                <p className="text-80s-yellow drop-shadow-[0_0_8px_hsl(var(--80s-yellow))]">
                  Totally tubular web developer with a passion for crafting rad user experiences. Let&apos;s build something awesome!
                </p>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-80s-cyan drop-shadow-[0_0_8px_hsl(var(--80s-cyan))] mb-4">
              About Me
            </h2>
            <p className="text-foreground">
              Greetings, fellow traveler of the information superhighway! I&apos;m Jason, a dedicated Staff Frontend Developer at Beyond, Inc., with a knack for turning digital dreams into reality.
            </p>
            <p className="text-foreground mt-4">
              My journey in the realm of web development has been an exciting one, filled with challenges and triumphs. From scaling MVPs to transitioning apps to Next.js with TypeScript, I&apos;ve always been eager to learn and adapt.
            </p>
            <p className="text-foreground mt-4">
              I&apos;m passionate about delivering high-quality user experiences, focusing on mobile-first principles, performance optimization, and core web vitals. I thrive on collaboration and problem-solving, and I&apos;m always ready to tackle the next coding quest.
            </p>
          </section>

          {/* Skills Section */}
          <section id="skills" className="mb-16">
            <h2 className="text-2xl font-bold text-80s-cyan drop-shadow-[0_0_8px_hsl(var(--80s-cyan))] mb-4">
              Skills
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg shadow-[0_0_10px_var(--80s-magenta)] border border-80s-magenta">
                <h3 className="font-semibold text-80s-cyan drop-shadow-[0_0_4px_hsl(var(--80s-cyan))] mb-2">
                  Frontend
                </h3>
                <ul className="list-disc list-inside text-foreground">
                  <li>React.js</li>
                  <li>Next.js</li>
                  <li>TypeScript</li>
                  <li>JavaScript</li>
                  <li>HTML</li>
                  <li>CSS</li>
                  <li>Material UI</li>
                  <li>Webpack</li>
                  <li>Storybook</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg shadow-[0_0_10px_var(--80s-magenta)] border border-80s-magenta">
                <h3 className="font-semibold text-80s-cyan drop-shadow-[0_0_4px_hsl(var(--80s-cyan))] mb-2">
                  Backend
                </h3>
                <ul className="list-disc list-inside text-foreground">
                  <li>Node.js</li>
                  <li>Express</li>
                  <li>REST APIs</li>
                  <li>GraphQL</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg shadow-[0_0_10px_var(--80s-magenta)] border border-80s-magenta">
                <h3 className="font-semibold text-80s-cyan drop-shadow-[0_0_4px_hsl(var(--80s-cyan))] mb-2">
                  DevOps & Tools
                </h3>
                <ul className="list-disc list-inside text-foreground">
                  <li>Git</li>
                  <li>Bitbucket</li>
                  <li>Docker</li>
                  <li>Kubernetes</li>
                  <li>Jenkins</li>
                  <li>Jest</li>
                  <li>React Testing Library</li>
                  <li>ESLint</li>
                  <li>Prettier</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Experience Section */}
          <section id="experience" className="mb-16">
            <h2 className="text-2xl font-bold text-80s-cyan drop-shadow-[0_0_8px_hsl(var(--80s-cyan))] mb-4">
              Experience
            </h2>

            {/* ShedRx */}
            <div className="mb-8 p-6 rounded-lg shadow-[0_0_10px_var(--80s-magenta)] border border-80s-magenta">
              <h3 className="text-xl font-semibold text-80s-cyan drop-shadow-[0_0_4px_hsl(var(--80s-cyan))] mb-2">
                Principal Developer | March 2025 - Present
              </h3>
              <p className="text-80s-yellow mb-2">
                Shed
              </p>
              {/* <ul className="list-disc list-inside text-foreground">
                <li></li>
              </ul> */}
            </div>

            {/* Beyond, Inc. */}
            <div className="mb-8 p-6 rounded-lg shadow-[0_0_10px_var(--80s-magenta)] border border-80s-magenta">
              <h3 className="text-xl font-semibold text-80s-cyan drop-shadow-[0_0_4px_hsl(var(--80s-cyan))] mb-2">
                Staff Frontend Developer | October 2024 - March 2025
              </h3>
              <p className="text-80s-yellow mb-2">
                Beyond, Inc.
              </p>
              <ul className="list-disc list-inside text-foreground">
                <li>
                  Collaborated with cross-functional teams to scale an MVP and adapt it to a growing customer base.
                </li>
                <li>
                  Setup DevOps with Git, Bitbucket, Docker, Kubernetes, and Jenkins.
                </li>
                <li>
                  Developed the app using Next.js, TypeScript, React, and Material UI.
                </li>
                <li>
                  Used Jest and React Testing Library for testing.
                </li>
                <li>
                  Developed a platform for trade professionals to create and share custom boards, access resources, and share on social networks.
                </li>
                <li>
                  Implemented user kickbacks for sales and PDF generation using Puppeteer.
                </li>
                <li>
                  Focused on delivering high-quality user experiences, mobile-first principles, performance optimization, and core web vitals.
                </li>
                <li>
                  Ensured testability and error handling, using ESLint and Prettier.
                </li>
                <li>
                  Took on an &quot;A-Team&quot; role, resolving high-priority issues.
                </li>
                <li>
                  Worked to relaunch the Beyond+ loyalty program with completely new APIs and coordinated with the Ireland-based team.
                </li>
                <li>
                  Led the front-end efforts on a project that required quickly assimilating domain knowledge on international trade and collaborating with external vendors.
                </li>
              </ul>
            </div>

            {/* Senior Frontend Developer */}
            <div className="mb-8 p-6 rounded-lg shadow-[0_0_10px_var(--80s-magenta)] border border-80s-magenta">
              <h3 className="text-xl font-semibold text-80s-cyan drop-shadow-[0_0_4px_hsl(var(--80s-cyan))] mb-2">
                Senior Frontend Developer | June 2018 - October 2024
              </h3>
              <p className="text-80s-yellow mb-2">
                Beyond, Inc.
              </p>
              <ul className="list-disc list-inside text-foreground">
                <li>
                  Transitioned OverstockGovernment.com from a JSX-based Create React App to Next.js with TypeScript, improving scalability, performance, and meeting stringent security standards required by state and federal agencies, including the FBI and NSA.
                </li>
                <li>
                  Specialized in creating isomorphic React applications using Node.js to enhance SEO and improve user experience with faster Time-to-Interactive (TTI) metrics.
                </li>
                <li>
                  Followed best practices such as Style- and ES-Linting and used Jest for thorough unit testing to ensure high-quality code.
                </li>
                <li>
                  Developed a streamlined REST messaging service that delivers HTML fragments with inline styling, making it easily consumable by other rendering services.
                </li>
              </ul>
            </div>

            {/* Frontend Developer */}
            <div className="mb-8 p-6 rounded-lg shadow-[0_0_10px_var(--80s-magenta)] border border-80s-magenta">
              <h3 className="text-xl font-semibold text-80s-cyan drop-shadow-[0_0_4px_hsl(var(--80s-cyan))] mb-2">
                Frontend Developer | August 2013 - May 2018
              </h3>
              <p className="text-80s-yellow mb-2">
                Beyond, Inc.
              </p>
              <ul className="list-disc list-inside text-foreground">
                <li>
                  Responsible for converting designs from Photoshop and Zeplin into functional user interfaces for websites and internal applications.
                </li>
                <li>
                  Handled troubleshooting, collaborating with development and QA teams on special projects.
                </li>
                <li>
                  Ensured SEO best practices, adhering to style guide/code conformity, and optimizing page weight for better performance.
                </li>
                <li>
                  Oversaw site optimization, acted as a liaison between the creative department, NOC, and IT, and ensured internal documentation was up to date.
                </li>
                <li>
                  Constantly focused on expanding coding skills.
                </li>
              </ul>
            </div>

            {/* Web Content Manager */}
            <div className="mb-8 p-6 rounded-lg shadow-[0_0_10px_var(--80s-magenta)] border border-80s-magenta">
              <h3 className="text-xl font-semibold text-80s-cyan drop-shadow-[0_0_4px_hsl(var(--80s-cyan))] mb-2">
                Web Content Manager | March 2010 - July 2013
              </h3>
              <p className="text-80s-yellow mb-2">
                XanGo
              </p>
              <ul className="list-disc list-inside text-foreground">
                <li>
                  Wore many hats at XANGO.
                </li>
                <li>
                  Responsible for creating, developing, and managing content across XANGO&apos;s web presence.
                </li>
                <li>
                  Role included everything from coordinating web projects and email campaigns across departments to ensuring consistency across all digital properties.
                </li>
                <li>
                  Automated email flows, analyzed campaign performance.
                </li>
              </ul>
            </div>

            {/* Service Desk Specialist */}
            <div className="mb-8 p-6 rounded-lg shadow-[0_0_10px_var(--80s-magenta)] border border-80s-magenta">
              <h3 className="text-xl font-semibold text-80s-cyan drop-shadow-[0_0_4px_hsl(var(--80s-cyan))] mb-2">
                Service Desk Specialist | June 2005 - March 2010
              </h3>
              <p className="text-80s-yellow mb-2">
                XanGo
              </p>
              <ul className="list-disc list-inside text-foreground">
                <li>
                  Took on roles as Supervisor, Technician, and Agent.
                </li>
                <li>
                  Specialized in training users.
                </li>
                <li>
                  Earned Apple Certified Technical Coordinator license.
                </li>
              </ul>
            </div>

            {/* Customer Service Agent */}
            <div className="mb-8 p-6 rounded-lg shadow-[0_0_10px_var(--80s-magenta)] border border-80s-magenta">
              <h3 className="text-xl font-semibold text-80s-cyan drop-shadow-[0_0_4px_hsl(var(--80s-cyan))] mb-2">
                Customer Service Agent | February 2005 - May 2005
              </h3>
              <p className="text-80s-yellow mb-2">
                XanGo
              </p>
              <ul className="list-disc list-inside text-foreground">
                <li>
                  Handled calls, engaging with distributors.
                </li>
                <li>
                  Assisted with account management.
                </li>
              </ul>
            </div>
          </section>

          {/* Projects Section */}
          <section id="projects" className="mb-16">
            <h2 className="text-2xl font-bold text-80s-cyan drop-shadow-[0_0_8px_hsl(var(--80s-cyan))] mb-4">
              Projects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg shadow-[0_0_10px_var(--80s-magenta)] border border-80s-magenta">
                <h3 className="font-semibold text-80s-cyan drop-shadow-[0_0_4px_hsl(var(--80s-cyan))] mb-2">
                  Trade
                </h3>
                <a href="https://www.bedbathandbeyond.com/trade/profiles/1/Tiffany%20Doe" target="_blank">
                  <Image
                    alt="Trade Project"
                    className="w-full h-48 object-cover rounded-t-lg mb-4"
                    height={300}
                    src="/trade.jpeg"
                    width={500}
                  />
                </a>
                <p className="text-foreground">
                  I worked with cross-functional teams to scale an MVP for a growing customer base, setting up DevOps with Git, Bitbucket, Docker, Kubernetes, and Jenkins. I used Next.js, TypeScript, React, and Material UI for the app, and implemented Jest and React Testing Library for testing. The platform enabled trade professionals to create custom boards, access resources, share on social media, earn kickbacks, and generate PDFs for accounting and taxes.
                </p>
              </div>
              <div className="p-4 rounded-lg shadow-[0_0_10px_var(--80s-magenta)] border border-80s-magenta">
                <h3 className="font-semibold text-80s-cyan drop-shadow-[0_0_4px_hsl(var(--80s-cyan))] mb-2">
                  Loyalty
                </h3>
                <a href="https://www.bedbathandbeyond.com/beyondplus/benefits"  target="_blank">
                  <Image
                    alt="Loyalty Project"
                    className="w-full h-48 object-cover rounded-t-lg mb-4"
                    height={300}
                    src="/loyalty.jpeg"
                    width={500}
                  />
                </a>
                <p className="text-foreground">
                  I&apos;m passionate about delivering high-quality user experiences, emphasizing mobile-first design, performance optimization, and core web vitals. I also focused on testability and error handling, using tools like ESLint and Prettier for standardized code. In my last role, I played a key part in relaunching the Beyond+ loyalty program with new APIs, working closely with the Ireland-based team to exceed the launch timeline.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="mb-16">
            <h2 className="text-2xl font-bold text-80s-cyan drop-shadow-[0_0_8px_hsl(var(--80s-cyan))] mb-4">
              Contact
            </h2>
            <p className="text-foreground">
              Want to connect? Reach out and let&apos;s chat!
            </p>
            <p className="text-80s-yellow mt-4">
              Email: <a href="mailto:itzjonas@gmail.com" className="transition-colors duration-200">itzjonas@gmail.com</a>
            </p>
            <p className="text-80s-yellow mt-2">
              LinkedIn: <a
                className="transition-colors duration-200"
                href="https://www.linkedin.com/in/jasonseegmiller"
                rel="noopener noreferrer"
                target="_blank"
              >
                www.linkedin.com/in/jasonseegmiller
              </a>
            </p>
            <p className="text-80s-yellow mt-2">
              GitHub: <a href="https://github.com/itzjonas" className="transition-colors duration-200">github.com/itzjonas</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
