import type { NextPage } from "next";
import Link from "next/link";
import Navbar from "../structures/dashboard/components/Navbar";
import { signIn, signOut, useSession, getSession } from "next-auth/client";

const Index: NextPage = () => {
    const [session, loading] = useSession()
    return (
        <div className="hero">
            <div className="hero-body">
                <div className="container">
                    <h1 className="title">
                        Mythcord.
                    </h1>
                    <p className="subtitle">
                        Yet another multipurpose bot for Discord!
                    </p>
                    <Link href="https://discord.gg/6FX8x9w2fn">
                        <a
                            className="call-to-action call-to-action-regular"
                        >
                            Discord
                        </a>
                    </Link>
                    <Link href="https://github.com/mythcordbot">
                        <a
                            className="call-to-action call-to-action-regular"
                        >
                            GitHub
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export async function getServerSideProps(context) {
    return {
        props: {
            session: await getSession(context)
        }
    }
}

export default Index;