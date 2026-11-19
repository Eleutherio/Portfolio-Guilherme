import { Children, cloneElement, isValidElement, type CSSProperties, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  selected: boolean;
  active: boolean;
  reducedMotion: boolean;
  duration: number;
  complete: boolean;
};

export function TestimonialAuthorDetails({
  children,
  selected,
  active,
  reducedMotion,
  duration,
  complete,
}: Props) {
  const fields = Children.toArray(children).filter(isValidElement);
  const stagger = fields.length > 1 ? Math.max(0, duration - 300) / (fields.length - 1) : 0;

  return (
    <span
      className="testimonial-editorial-author-copy testimonial-author-reveal"
      data-reveal={selected && !reducedMotion ? "true" : "false"}
      data-active={active ? "true" : "false"}
      data-complete={complete ? "true" : "false"}
    >
      {fields.map((field, index) =>
        isValidElement<{ style?: CSSProperties }>(field)
          ? cloneElement(field, {
              style: {
                ...field.props.style,
                "--author-delay": `${index * stagger}ms`,
                "--author-duration": `${fields.length > 1 ? 300 : duration}ms`,
              } as CSSProperties,
            })
          : field,
      )}
    </span>
  );
}
