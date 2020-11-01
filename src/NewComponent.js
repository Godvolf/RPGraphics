import React, {useState} from 'react';

export default function NewComponent(var1, var2) {

    const [zmienna, setZmienna] = useState(0);

    function zwiekszZmienna () {
        setZmienna(zmienna + 1);
        return ;
    }



    return (
        <div>
            <div>Jakiś tekst {zmienna} </div>
            <button onClick={()=>{zwiekszZmienna()}} />
        </div>
    )
}