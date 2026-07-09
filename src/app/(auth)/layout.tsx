import ThreeJsScene from '@/features/auth/components/ThreeJsScene';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Form Side */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-[500px] xl:w-[600px] z-10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-2xl">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          {children}
        </div>
      </div>

      {/* 3D Scene Side */}
      <div className="hidden lg:block relative flex-1">
        <div className="absolute inset-0 h-full w-full object-cover">
          <ThreeJsScene />
        </div>
      </div>
    </div>
  );
}
