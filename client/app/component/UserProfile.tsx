

export default function UserProfile({userData}) {
  return (
    <div>
      <ul>
        <li>Name: {userData.name}</li>
        <li>Phone: {userData.phone}</li>
      </ul>
    </div>
  )
}
