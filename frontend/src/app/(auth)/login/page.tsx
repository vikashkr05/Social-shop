import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-bg">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-accent-pink flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 9a3 3 0 100 6 3 3 0 000-6z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold gradient-text">Project Cart</h1>
          <p className="text-text-muted text-sm mt-1">Sign in to your account</p>
        </div>
        <div className="bg-bg-card border border-border rounded-2xl p-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
