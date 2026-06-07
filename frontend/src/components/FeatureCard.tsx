import Link from "next/link";

interface Props {
  title: string;
  description: string;
  href: string;
}

export default function FeatureCard({
  title,
  description,
  href,
}: Props) {
  return (
    <Link
      href={href}
      className="
        rounded-xl
        border
        bg-white
        p-6
        shadow-sm
        transition
        hover:shadow-lg
      "
    >
      <h2 className="text-xl font-semibold">
        {title}
      </h2>

      <p className="mt-2 text-gray-600">
        {description}
      </p>
    </Link>
  );
}