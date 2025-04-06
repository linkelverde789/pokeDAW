

function Input({type, onChange, placeholder, id, min, max, name, defaultValue}){
    return <input type={type} id={id} placeholder={placeholder} onChange={onChange} min={min} max={max} name={name} defaultValue={defaultValue} className="input-Pazos"/>
}

export default Input;