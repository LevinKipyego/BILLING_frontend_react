const NetworkAlerts = ({ alerts }: { alerts: string[] }) => {

  if (!alerts.length) return null

  return (
    <div className="bg-red-50 p-4 rounded-xl border border-red-300">

      <h2 className="font-bold text-red-600">
        Network Alerts
      </h2>

      <ul className="mt-2 list-disc ml-4">
        {alerts.map((a, i) => (
          <li key={i}>{a}</li>
        ))}
      </ul>
    </div>
  )
}
export default NetworkAlerts