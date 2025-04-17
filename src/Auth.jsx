import {Button, Form, Input, Tabs, message} from "antd";

const API = "http://localhost:3000/users";

export const Auth = () => {
    const onLogin = async (values) => {
        const res = await fetch(`${API}?username=${values.username}&password=${values.password}`);
        const users = await res.json();
        if (users.length > 0) {
            sessionStorage.setItem("userAuth", JSON.stringify(users[0]));
            location.reload();
        } else {
            message.error("Неверные данные");
        }
    };

    const onRegister = async (values) => {
        const check = await fetch(`${API}?username=${values.username}`);
        const existing = await check.json();
        if (existing.length > 0) {
            message.error("Пользователь уже существует");
            return;
        }

        const newUser = {
            username: values.username,
            password: values.password,
            role: "user"
        };

        await fetch(API, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newUser)
        });

        message.success("Успешная регистрация");
    };

    return (
        <div className="login_container">
            <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="Вход" key="1">
                    <Form onFinish={onLogin} layout="vertical">
                        <Form.Item name="username" label="Логин" rules={[{required: true}]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="password" label="Пароль" rules={[{required: true}]}>
                            <Input.Password />
                        </Form.Item>
                        <Button htmlType="submit" type="primary">Войти</Button>
                    </Form>
                </Tabs.TabPane>

                <Tabs.TabPane tab="Регистрация" key="2">
                    <Form onFinish={onRegister} layout="vertical">
                        <Form.Item name="username" label="Логин" rules={[{required: true}]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="password" label="Пароль" rules={[{required: true}]}>
                            <Input.Password />
                        </Form.Item>
                        <Button htmlType="submit">Зарегистрироваться</Button>
                    </Form>
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
};
