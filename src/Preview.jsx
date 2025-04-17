import {useParams} from "react-router";
import {useEffect, useState} from "react";
import {Carousel} from "antd";

export const Preview = () => {
    const {item_id} = useParams();
    const [car, setCar] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3000/cars/${item_id}`)
            .then(res => res.json())
            .then(setCar);
    }, [item_id]);

    if (!car) return <p>Загрузка...</p>;

    return (
        <div style={{maxWidth: 900, margin: "20px auto", padding: 24, boxShadow: "0 0 15px #eee", borderRadius: 10}}>
            <Carousel autoplay dotPosition="bottom" arrows>
                {car.imageUrls.map((url, idx) => (
                    <div key={idx}>
                        <img
                            src={url}
                            alt={`Фото ${idx + 1}`}
                            style={{
                                width: "100%",
                                height: 500,
                                objectFit: "cover",
                                borderRadius: 10
                            }}
                        />
                    </div>
                ))}
            </Carousel>

            <h2 style={{marginTop: 20, fontSize: "2em"}}>{car.title}</h2>
            <p style={{fontSize: "1.5em", color: "#1a1a1a", fontWeight: "bold"}}>
                {car.price.toLocaleString()} ₽
            </p>
            <p style={{color: "#888", marginBottom: 12}}>
                <b>Город:</b> {car.location}
            </p>
            <p style={{fontSize: "1.1em", lineHeight: 1.6}}>
                {car.description}
            </p>
        </div>
    );
};