import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogOverlay, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import useHostStore from "@/stores/useHostStore";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";

interface SSHConfigDialogProps {
    children?: React.ReactNode;
    onSuccess?: () => void; // 添加成功回调
    initialData?: Partial<HostData>; // 支持编辑模式
}

export const SSHConfigDialog: React.FC<SSHConfigDialogProps> = ({ children, onSuccess, initialData }) => {
    const { getHosts } = useHostStore();
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<Partial<HostData>>({
        host: initialData?.host || '',
        port: initialData?.port || '22',
        username: initialData?.username || '',
        alias: initialData?.alias || '',
        password: ''
    });

    useEffect(() => {
        const decryptPassword = async () => {
            if (initialData?.password && initialData?.password_iv) {
                const pwd = await window.common.decryptPassword(
                    initialData.password,
                    initialData.password_iv
                );
                setForm({
                    ...form,
                    password: pwd
                })
            }
        };
        decryptPassword();
    }, [initialData]);

    const validate = () => {
        if (!form.alias) {
            toast("请输入别名");
            return false;
        }
        if (!form.host) {
            toast("请输入IP");
            return false;
        }
        if (!form.port) {
            toast("请输入端口");
            return false;
        }
        if (!form.username) {
            toast("请输入用户名");
            return false;
        }
        if (!form.password) {
            toast("请输入密码");
            return false;
        }
        return true;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        let { id, value } = e.target;
        setForm({
            ...form,
            [id]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validate()) return;
        if (initialData?.id) {
            await window.host.update(initialData.id, {
                ...initialData,
                ...form
            });
            toast("🎉 成功更新服务器");
        } else {
            await window.host.save(form);
            toast("🎉 成功添加服务器");
        };
        getHosts();
        onSuccess && onSuccess();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                {children}
            </DialogTrigger>
            <DialogOverlay onClick={(e) => e.stopPropagation()}>
                <DialogContent className="w-[350px]">
                    <DialogHeader>
                        <DialogTitle>{initialData ? '更新SSH' : '创建SSH'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-4">
                            <div>
                                <Label htmlFor="alias">别名</Label>
                                <Input id="alias" value={form?.alias} onChange={handleChange}></Input>
                            </div>
                            <div className="flex gap-2">
                                <div>
                                    <Label htmlFor="host">IP</Label>
                                    <Input id="host" value={form?.host} onChange={handleChange}></Input>
                                </div>
                                <div className="flex-1">
                                    <Label htmlFor="port">端口</Label>
                                    <Input id="port" value={form?.port} onChange={handleChange}></Input>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="username">用户名</Label>
                                <Input id="username" value={form?.username} onChange={handleChange}></Input>
                            </div>
                            <div>
                                <Label htmlFor="password">密码</Label>
                                <PasswordInput id="password" value={form?.password} onChange={handleChange}></PasswordInput>
                            </div>
                        </div>
                        <DialogFooter className="mt-8">
                            <Button onClick={() => setOpen(false)} type="button" variant="outline" className="justify-center w-full">取消</Button>
                            <Button type="submit" className="justify-center w-full">保存</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </DialogOverlay>
        </Dialog>
    )
};