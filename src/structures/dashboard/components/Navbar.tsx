   
import React from "react";

import Link from "next/link";

interface Session {
    user: any;
}

interface IState {
    isActive: boolean;
}

interface IProps {
    session: Session;
}

import { useSession, signIn, signOut} from "next-auth/client"

const withSession = ClassComponent => props => {
  const session = useSession()
  
  if(ClassComponent.prototype.render) {
    return <ClassComponent session={session} {...props}/>
  }

  throw new Error([
   "You passed a function component, `withSession` is not needed.",
   "You can `useSession` directly in your component."
  ].join("\n"))
}

class Navbar extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            isActive: false,
        };
        console.log(this.props.session[0]);
    }
    private _handleNavigation = () => {
        this.setState((prevState) => {
            return {
                isActive: !prevState.isActive,
            };
        });
    };
    render() {
        return (
            <nav className="navbar is-spaced">
                <div className="navbar-brand">
                        <Link href="/">
                            <a className="navbar-item navbar-title">Mythcord</a>
                        </Link>
                    <a
                        className={
                            this.state.isActive
                                ? "navbar-burger is-active"
                                : "navbar-burger"
                        }
                        aria-label="menu"
                        aria-expanded="false"
                        data-target="navbarMenu"
                        onClick={this._handleNavigation}
                    >
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>
                <div
                    className={
                        this.state.isActive
                            ? "navbar-menu is-active "
                            : "navbar-menu"
                    }
                    id="navbarMenu"
                >
                    <div className="navbar-end">
                        <Link href="/">
                            <a className="navbar-item">Home</a>
                        </Link>
                        {/* <Link href="/commands">
                            <a className="navbar-item">Commands</a>
                        </Link> */}
                        {!this.props.session[0] && (
                            <button className="call-to-action call-to-action-regular navbar-item"  onClick={() => signIn("discord")}>Sign in</button>
                        )}
                        {this.props.session[0] && (
                            <>
                                {/* <Link href="/dashboard">
                                    <a className="navbar-item">Dashboard</a>
                                </Link> */}
                                <button className="call-to-action call-to-action-regular navbar-item"  onClick={() => signOut()}>Sign Out</button>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        );
    }
}

export default withSession(Navbar);