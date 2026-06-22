export default function FreeTextComponent({ placeholder, label}) {
  
  return (
    <>
        <div className="freetexfiled" style={{display:'flex'}}>
        <div className="title">{label} :</div>
        <div className="text">{placeholder}</div>
        </div>
    </>
  );
}
