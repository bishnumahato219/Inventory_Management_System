export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full p-8 shadow rounded-xl">
        <h2 className="text-2xl font-bold mb-4">
          Reset Password
        </h2>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border px-4 py-3 rounded-lg"
        />
        <button className="mt-4 w-full bg-orange-500 text-white py-3 rounded-lg">
          Send Reset Link
        </button>
      </div>
    </div>
  );
}
