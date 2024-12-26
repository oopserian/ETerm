import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader, DialogOverlay, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

interface ConfigDialogProps {
    children?: React.ReactNode;
    onSuccess?: () => void; // 添加成功回调
    initialData?: Partial<CommandSnippetData>; // 支持编辑模式
}

export const SnippetConfigDialog: React.FC<ConfigDialogProps> = ({ children, onSuccess, initialData }) => {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<{
        name: string,
        des: string,
        command: string
    }>({
        name: initialData?.name || '',
        des: initialData?.des || '',
        command: initialData?.command || ''
    });

    const example = `example:
    ps -ef | grep node
    df -h
    top -n 1
    `;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        let { id, value } = e.target;
        setForm({
            ...form,
            [id]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!form.command) {
            toast.info('请填写命令!');
            return;
        };
        if (initialData?.id) {
            await window.commandSnippet.update(initialData.id, {
                ...initialData,
                ...form
            });
            toast("🎉 成功更新片段");
        } else {
            await window.commandSnippet.create(form);
            toast("🎉 成功添加片段");
        };
        onSuccess && onSuccess();
        setOpen(false);
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                {children}
            </DialogTrigger>
            <DialogOverlay onClick={(e) => e.stopPropagation()}>
                <DialogContent className="w-[300px]">
                    <DialogHeader>
                        <DialogTitle>{initialData ? '更新代码片段' : '创建代码片段'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-4">
                            <div>
                                <Label htmlFor="name">名字</Label>
                                <Input id="name" value={form?.name} onChange={handleChange}></Input>
                            </div>
                            <div>
                                <Label htmlFor="des">描述</Label>
                                <Input id="des" value={form?.des} onChange={handleChange}></Input>
                            </div>
                            <div>
                                <Label htmlFor="command">命令*</Label>
                                <Textarea placeholder={example}
                                    className="resize-none"
                                    rows={4}
                                    id="command"
                                    value={form?.command}
                                    onChange={handleChange}></Textarea>
                            </div>
                            <div className="flex gap-2">
                                <Button type="button" onClick={() => setOpen(false)} variant="outline" className="justify-center w-full">取消</Button>
                                <Button type="submit" className="justify-center w-full">保存</Button>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </DialogOverlay>
        </Dialog>)
}