export const ColoredMessage = (props) =>{
  console.log(props);
const contentStyle = {
  color:"blue",
  fontSize:"20px"
};

const contentPinkStyle = {
  color:"pink",
  fontSize:"20px"
};
return <p style={contentStyle}>잘지내시죠?</p>;
}