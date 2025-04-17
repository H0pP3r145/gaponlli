import {useState} from "react";

export const AddCar = () => {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [location, setLocation] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleImageUpload = async () => {
        const formData = new FormData();
        if (!(file instanceof Blob)) {
            alert("Файл невалиден!");
            return;
        }
        formData.append("image", file);
        const res = await fetch(`https://api.imgbb.com/1/upload?key=9a5953b57a7006590185ef9b832c94a5`, {
            method: "POST",
            body: formData
        });
        const data = await res.json();
        return data.data.url;
    };

    const handleSubmit = async () => {
        if (!file) return alert("Выбери изображение!");

        setLoading(true);
        const imageUrl = await handleImageUpload();

        const newCar = {
            title,
            price: parseInt(price),
            location,
            imageUrl
        };

        await fetch("http://localhost:3000/cars", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newCar)
        });

        alert("Объявление добавлено!");
        setTitle("");
        setPrice("");
        setLocation("");
        setFile(null);
        setLoading(false);
        location.reload(); // или можно обновить state, но так проще
    };

    return (
        <div className="login_container">
            <h2>Добавить машину</h2>
            <input placeholder="Название" value={title} onChange={e => setTitle(e.target.value)}/>
            <input placeholder="Цена" value={price} onChange={e => setPrice(e.target.value)}/>
            <input placeholder="Город" value={location} onChange={e => setLocation(e.target.value)}/>
            <input type="file" onChange={e => setFile(e.target.files[0])}/>
            <button onClick={handleSubmit} disabled={loading}>
                {loading ? "Загрузка..." : "Сохранить"}
            </button>
        </div>
    );
};