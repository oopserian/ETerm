import { Button } from "@/components/button/button";
import Dialog from "@/components/dialog/dialog";
import { FormInput, FormItem } from "@/components/form/form";
import { useState } from "react";

export const CreateSSHDialog: React.FC<{ open: boolean, onclose: () => void }> = ({ open, onclose }) => {
    const [form, setForm] = useState<sshData>({
        host: '',
        port: '',
        username: '',
        alias: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        let { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        window.ssh.save(form);
    };

    return (
        <Dialog title="添加SSH" open={open} onClose={onclose}>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
                    <FormItem title="别名">
                        <FormInput name="alias" value={form?.alias} onChange={handleChange}></FormInput>
                    </FormItem>
                    <div className="flex gap-2">
                        <FormItem title="IP">
                            <FormInput name="host" value={form?.host} onChange={handleChange}></FormInput>
                        </FormItem>
                        <FormItem className="flex-1" title="端口">
                            <FormInput name="port" value={form?.port} onChange={handleChange}></FormInput>
                        </FormItem>
                    </div>
                    <FormItem title="用户名">
                        <FormInput name="host" value={form?.host} onChange={handleChange}></FormInput>
                    </FormItem>
                    <FormItem title="密码">
                        <FormInput name="password" type="password" value={form?.password} onChange={handleChange}></FormInput>
                    </FormItem>
                    <div className="flex gap-2">
                        <Button onClick={onclose} variant="secondary">取消</Button>
                        <Button type="submit">保存</Button>
                    </div>
                </div>
            </form>
        </Dialog>
    )
};