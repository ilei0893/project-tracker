export default function Task({
  title,
  author,
}: {
  title: string;
  author: string;
}) {
  return (
    <button className="project__listItem">
      <h5>{title}</h5>
      <span></span>
    </button>
  );
}
