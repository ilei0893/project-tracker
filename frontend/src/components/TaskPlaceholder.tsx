export default function TaskPlaceholder() {
  return (
    <div className="project__listItem loading">
      <div
        className="project__listItem__loading__bar"
        style={{ width: "90%" }}
      ></div>{" "}
      <span
        className="project__listItem__loading__bar"
        style={{ width: "50%" }}
      ></span>{" "}
    </div>
  );
}
