import { Button } from "@/components/ui/button"
import { CardItem } from "@/components/card/card"
import Dialog from "@/components/dialog/dialog";
import { FormInput, FormItem, FormTextarea } from "@/components/form/form";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { IconCode, IconPlus } from "@tabler/icons-react";

export const Snippet = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [commandSnippet, setCommandSnippet] = useState<Record<number, CommandSnippetData>>({});
    const commandSnippetList = useMemo(() => Object.values(commandSnippet), [commandSnippet]);
    const getData = async () => {
        let data = await window.commandSnippet.get();
        setCommandSnippet(data);
    };

    useEffect(() => {
        getData();
    }, [open]);

    return (
        <>
            <CreateSnippet open={open} onclose={() => setOpen(false)} />
            <div className="py-3 pr-3 flex flex-col gap-2">
                <div className="flex justify-between">
                    <p className="font-medium text-lg">命令片段</p>
                    <Button onClick={() => setOpen(true)} variant="default" size="sm" className="justify-center">
                        <IconPlus />
                        <p>新增片段</p>
                    </Button>
                </div>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-2">
                    {
                        commandSnippetList.map(item => (
                            <SnippetItem key={item.id} data={item}></SnippetItem>
                        ))
                    }
                </div>
            </div>
        </>
    )
};


export const SnippetItem: React.FC<{ data: CommandSnippetData }> = ({ data }) => {
    return (
        <CardItem icon={<IconCode />}>
            <p className="text-xs">{data.name}</p>
            <div className="flex text-xs text-zinc-500">
                <p>{data.des || data.command}</p>
            </div>
        </CardItem>
    )
}

export const CreateSnippet: React.FC<{ open: boolean, onclose: () => void }> = ({ open, onclose }) => {
    const [form, setForm] = useState<{
        name: string,
        des: string,
        command: string
    }>({
        name: '',
        des: '',
        command: ''
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
        if (!form.command) {
            toast.info('请填写命令!');
            return;
        };
        window.commandSnippet.create(form);
        onclose();
        toast("🎉 成功添加片段");
    };


    return (
        <Dialog title="新增代码片段" open={open} onClose={onclose}>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
                    <FormItem title="名字">
                        <FormInput name="name" value={form?.name} onChange={handleChange}></FormInput>
                    </FormItem>
                    <FormItem title="描述">
                        <FormInput name="des" value={form?.des} onChange={handleChange}></FormInput>
                    </FormItem>
                    <FormItem title="命令*">
                        <FormTextarea rows={6} className="resize-none" name="command" value={form?.command} onChange={handleChange}></FormTextarea>
                    </FormItem>
                    <div className="flex gap-2">
                        <Button onClick={onclose} variant="outline" className="justify-center w-full">取消</Button>
                        <Button type="submit" className="justify-center w-full">保存</Button>
                    </div>
                </div>
            </form>
        </Dialog>)
}