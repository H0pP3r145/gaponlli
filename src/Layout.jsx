import {Outlet} from "react-router";
import {useEffect, useState} from "react";
import {Button, Form, Input, InputNumber, Modal, message} from "antd";
import {InboxOutlined} from "@ant-design/icons";
import Dragger from "antd/lib/upload/Dragger.js";

const API_KEY = "9a5953b57a7006590185ef9b832c94a5";

export const Layout = () => {
    const [userAuth] = useState(JSON.parse(sessionStorage.getItem("userAuth")));
    const isAdmin = userAuth?.role === "admin";

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const [messageApi, contextHolder] = message.useMessage();

    const [form] = Form.useForm();

    useEffect(() => {
        const handlePaste = (e) => {
            const item = [...e.clipboardData.items].find(i => i.type.includes("image"));
            if (item) {
                const file = item.getAsFile();
                if (file) {
                    setFiles(prev => [...prev, file]);
                    messageApi.success("Изображение добавлено из буфера");
                }
            }
        };
        window.addEventListener("paste", handlePaste);
        return () => window.removeEventListener("paste", handlePaste);
    }, [messageApi]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (files.length === 0) {
                messageApi.warning("Загрузите хотя бы одно изображение");
                return;
            }

            setLoading(true);
            const imageUrls = [];

            for (const file of files) {
                const formData = new FormData();
                formData.append("image", file);
                const res = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
                    method: "POST",
                    body: formData
                });
                const data = await res.json();
                imageUrls.push(data.data.url);
            }

            await fetch("http://localhost:3000/cars", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    ...values,
                    imageUrls
                })
            });

            messageApi.success("Объявление добавлено!");
            form.resetFields();
            setFiles([]);
            setIsModalOpen(false);
            window.location.reload();
        } catch (err) {
            console.error(err);
            messageApi.error("Ошибка при сохранении");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='App'>
            {contextHolder}
            <div className='router__content'>
                <div className={`header ${userAuth ? 'auth' : 'not_auth'}`}>
                    <h1>Gasoline Only</h1>
                    {isAdmin && (
                        <>
                            <Button onClick={() => setIsModalOpen(true)}>Добавить объявление</Button>
                            <Modal
                                title="Новое объявление"
                                open={isModalOpen}
                                onOk={handleOk}
                                onCancel={() => setIsModalOpen(false)}
                                confirmLoading={loading}
                                okText="Сохранить"
                                cancelText="Отмена"
                            >
                                <Form layout="vertical" form={form}>
                                    <Form.Item name="title" label="Название" rules={[{required: true}]}>
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item name="price" label="Цена" rules={[{required: true}]}>
                                        <InputNumber min={0} style={{width: "100%"}}/>
                                    </Form.Item>
                                    <Form.Item name="location" label="Город" rules={[{required: true}]}>
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item name="description" label="Описание" rules={[{required: true}]}>
                                        <Input.TextArea rows={3}/>
                                    </Form.Item>
                                    <Form.Item label="Изображения (можно перетащить или вставить)">
                                        <Dragger
                                            beforeUpload={(file) => {
                                                setFiles(prev => [...prev, file]);
                                                return false;
                                            }}
                                            multiple
                                            fileList={files.map((f, index) => ({
                                                uid: index,
                                                name: f.name,
                                                status: "done",
                                            }))}
                                            onRemove={(file) => {
                                                setFiles(prev => prev.filter(f => f.name !== file.name));
                                            }}
                                            showUploadList={{showRemoveIcon: true}}
                                        >
                                            <p className="ant-upload-drag-icon">
                                                <InboxOutlined/>
                                            </p>
                                            <p className="ant-upload-text">Кликни или перетащи изображения сюда</p>
                                            <p className="ant-upload-hint">Поддерживается вставка из буфера (Ctrl+V)</p>
                                        </Dragger>
                                    </Form.Item>
                                </Form>
                            </Modal>
                        </>
                    )}

                    {userAuth && (
                        <Button type="primary" onClick={() => {
                            sessionStorage.removeItem('userAuth');
                            location.reload();
                        }}>Выход</Button>
                    )}
                </div>

                <Outlet/>
            </div>
        </div>
    );
};