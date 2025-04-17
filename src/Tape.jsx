import {Link} from "react-router";
import {useEffect, useState} from "react";
import {Button, Carousel, message, Popconfirm} from "antd";

export const Tape = () => {
    const [cars, setCars] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/cars")
            .then(res => res.json())
            .then(data => setCars(data));
    }, []);

    return (
        <div className="Tape">
            {cars.map(car => (
                <Card key={car.id} {...car} itemId={car.id}/>
            ))}
        </div>
    );
};

// eslint-disable-next-line react/prop-types
const Card = ({title, price, location, imageUrls, itemId}) => {

    const user = JSON.parse(sessionStorage.getItem("userAuth"));
    const isAdmin = user?.role === "admin";
    const [messageApi, contextHolder] = message.useMessage();

    const handleDelete = async (e) => {
        e.stopPropagation();
        console.log("test")
        e.preventDefault();
        await fetch(`http://localhost:3000/cars/${itemId}`, {
            method: "DELETE"
        });
        messageApi.success("Объявление было успешно удалено")
        window.location.reload();
    };

    return (
        <div className="card">
            {contextHolder}
            <Link to={`/${itemId}`} style={{maxWidth: "360px"}}>
                <Carousel dotPosition="bottom" arrows>
                    {/* eslint-disable-next-line react/prop-types */}
                    {imageUrls.map((url, idx) => (
                        <div key={idx}>
                            <img
                                src={url}
                                alt={`Фото ${idx + 1}`}
                                style={{
                                    width: "100%",
                                    height: 200,
                                    objectFit: "cover",
                                    borderRadius: 10
                                }}
                            />
                        </div>
                    ))}
                </Carousel>

                <div className="card-content">
                    <h3 className="card-title">{title}</h3>
                    <div className="card-bottom">
                        <p className="card-price">{price.toLocaleString()} ₽</p>
                        <p className="card-location">{location}</p>
                    </div>
                </div>
            </Link>
            <div style={{
                marginTop: "10px",
                width: "100%",
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center"
            }}>
                {isAdmin && (
                    <Popconfirm
                        title="Удалить объявление"
                        description="Вы действительно уверены что хотите удалить данное объявление?"
                        onConfirm={handleDelete}
                        okText="Удалить"
                        cancelText="Отменить"
                    >
                        <Button danger>Удалить объявление</Button>
                    </Popconfirm>
                )}
            </div>
        </div>
    )
};
