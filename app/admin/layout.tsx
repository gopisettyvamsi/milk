
import AdminLayout from "@/components/layouts/AdminLayout";

/* import '@fullcalendar/common/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css'; */

//import '@fullcalendar/core/main.css';
// or just use the all-in-one CSS file:
//import '@fullcalendar/core/main.min.css';


export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children} </AdminLayout>;
}