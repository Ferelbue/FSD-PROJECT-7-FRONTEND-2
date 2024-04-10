import "./NewPost.css";

export const NewPost = (props) => {
  return (
    <img
      className={props.className}
      src={props.src}
      alt={props.alt}
      onClick={props.onClick}
    />
  );
};