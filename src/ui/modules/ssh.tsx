import { Button } from "@/components/button/button";
import Dialog from "@/components/dialog/dialog";
import { FormInput, FormItem } from "@/components/form/form";
import { useState } from "react";
import useHostStore from "@/stores/useHostStore";
import { toast } from "sonner";

export const CreateSSHDialog: React.FC<{ open: boolean, onclose: () => void }> = ({ open, onclose }) => {
    const { getHosts } = useHostStore();


    const [form, setForm] = useState<HostData>({
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
        window.host.save(form);
        getHosts();
        onclose();
        toast("🎉 成功添加服务器");
    };

    return (
        <Dialog title="添加服务器" open={open} onClose={onclose}>
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
                        <FormInput name="username" value={form?.username} onChange={handleChange}></FormInput>
                    </FormItem>
                    <FormItem title="密码">
                        <FormInput name="password" type="password" value={form?.password} onChange={handleChange}></FormInput>
                    </FormItem>
                    <div className="flex gap-2">
                        <Button onClick={onclose} variant="secondary" className="justify-center">取消</Button>
                        <Button type="submit" className="justify-center">保存</Button>
                    </div>
                </div>
            </form>
        </Dialog>
    )
};