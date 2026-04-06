import {
    About,
    Certifications,
    Contact,
    Education,
    Experience,
    Hero,
    Projects,
    Skills,
} from '@/components/portfolio/home';

export default function Home() {
    return (
        <div className="portfolio-root text-synth-text">
            <div className="portfolio-inner mx-auto flex w-full max-w-6xl flex-col py-8 sm:py-12 md:py-16 lg:py-20">
                <Hero />
                <About />
                <Skills />
                <Experience />
                <Education />
                <Certifications />
                <Projects />
                <Contact />
            </div>
        </div>
    );
}
