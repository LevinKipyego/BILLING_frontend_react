const Topbar = () => {
  return (
    <header className="h-14 bg-white shadow flex items-center justify-between px-4">
      <span className="font-semibold">Welcome, Vendor</span>
      <button className="text-sm text-red-600">Logout</button>
    </header>
  );
};

export default Topbar;
