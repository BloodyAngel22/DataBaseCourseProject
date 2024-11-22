import { Link } from "react-router-dom";
import { Link as NLink } from "@nextui-org/react";

export default function NavBar() {
	return (
		<>
			<nav>
				<ul className="flex flex-row gap-3 bg-slate-400 h-10 items-center">
					<li>
						<NLink as={Link} to="/" color="primary" isBlock>Home</NLink>
					</li>
					<li>
						<NLink as={Link} to="/about" color="primary" isBlock>About</NLink>
					</li>
					<li>
						<NLink as={Link} to="/hook-form" color="primary" isBlock>HookForm</NLink>
					</li>
					<li>
						<NLink as={Link} to="/error" color="primary" isBlock>Error</NLink>
					</li>
				</ul>
			</nav>
		</>
	);
}