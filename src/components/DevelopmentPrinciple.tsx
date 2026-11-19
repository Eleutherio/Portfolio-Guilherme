export function DevelopmentPrinciple({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <li className="principles-marquee__card">
      <h3 className="content-title text-foreground">{title}</h3>
      <p className="body-copy text-muted-foreground">{description}</p>
    </li>
  );
}
