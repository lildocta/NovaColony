import { toast, type ToastContentProps, type ToastOptions } from 'react-toastify';

interface NotificationData {
    title: string;
    content: string;
}

type CustomNotificationProps = ToastContentProps<NotificationData>;

function CustomNotification({ data, toastProps }: CustomNotificationProps) {
    const isColored = toastProps.theme === 'colored';
    const isError = toastProps.type === 'error';
    const isSuccess = toastProps.type === 'success';

    const titleColor = isError ? 'text-red-500' : (isSuccess ? 'text-green-500' : (isColored ? 'text-white' : 'text-zinc-800'));

    return (
        <div className={`flex flex-col p-2 w-full max-w-[400px]`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-1 ${titleColor}`}>
                {data.title}
            </h3>
            <div className="flex items-center justify-between">
                <p className="text-xs font-mono opacity-80">{data.content}</p>
            </div>
        </div>
    );
}

const defaultOptions: ToastOptions = {
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'dark',
    icon: false, // We use our own styling
};

export const notify = {
    info: (title: string, content: string) => {
        toast.info(CustomNotification, {
            ...defaultOptions,
            data: { title, content },
            className: '!bg-theme-surface/90 !backdrop-blur-md !border !border-theme-primary/30 !rounded-lg !shadow-[0_0_20px_rgba(var(--theme-primary),0.2)]',
        });
    },
    success: (title: string, content: string) => {
        toast.success(CustomNotification, {
            ...defaultOptions,
            data: { title, content },
            className: '!bg-theme-surface/90 !backdrop-blur-md !border !border-green-500/30 !rounded-lg !shadow-[0_0_20px_rgba(34,197,94,0.2)]',
        });
    },
    error: (title: string, content: string) => {
        toast.error(CustomNotification, {
            ...defaultOptions,
            autoClose: 5000,
            data: { title, content },
            className: '!bg-theme-surface/90 !backdrop-blur-md !border !border-red-500/30 !rounded-lg !shadow-[0_0_20px_rgba(239,68,68,0.2)]',
        });
    },
    warning: (title: string, content: string) => {
        toast.warn(CustomNotification, {
            ...defaultOptions,
            data: { title, content },
            className: '!bg-theme-surface/90 !backdrop-blur-md !border !border-yellow-500/30 !rounded-lg !shadow-[0_0_20px_rgba(234,179,8,0.2)]',
        });
    }
};
