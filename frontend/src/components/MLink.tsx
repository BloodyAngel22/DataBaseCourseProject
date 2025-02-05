import Link from "next/link";
import styles from "@/styles/MLink.module.scss";

interface MLinkProps {
	href: string;
	text: string;
}

export default function MLink({ href, text }: MLinkProps) {
	return (
		<Link className={styles.mLink} href={href}>{text}</Link>
	);
}