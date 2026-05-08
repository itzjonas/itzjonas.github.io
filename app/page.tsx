import { HomePageShell } from '@/components/portfolio/HomePageShell';
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
        <HomePageShell>
            <Hero />
            <About />
            <Skills />
            <Experience />
            <Education />
            <Certifications />
            <Projects />
            <Contact />
        </HomePageShell>
    );
}
