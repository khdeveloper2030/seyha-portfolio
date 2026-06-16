import { useState, useEffect } from "react";
import { UserPlus, Users, Trash2, GraduationCap, Calendar } from "lucide-react"; // ប្រសិនបើមិនទាន់មាន សូម npm install lucide-react
import {  Search, PlusCircle } from "lucide-react";
import './index.css'  // ត្រូវមានបន្ទាត់នេះ

function App() {
  const [formData, setFormData] = useState({ name: "", age: "", grade: "" });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:5000/students");
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/add-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: "", age: "", grade: "" });
        fetchStudents();
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

 const deleteStudent = async (id) => {
  if (window.confirm("តើអ្នកប្រាកដថាចង់លុបទិន្នន័យនេះមែនទេ?")) {
    try {
      const response = await fetch(`http://localhost:5000/students/${id}`, {
        method: "DELETE", // បញ្ជាក់ថាជាការលុប
      });

      if (response.ok) {
        // បន្ទាប់ពីលុបក្នុង DB រួច ត្រូវទាញទិន្នន័យថ្មីមកបង្ហាញភ្លាម
        fetchStudents(); 
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  }
};

return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-600">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-64 bg-gradient-to-br from-blue-600 to-indigo-700 -z-10 shadow-lg"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 py-12">
        {/* Header Section */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl">
                <GraduationCap size={32} className="text-white" />
              </div>
              <h1 className="text-4xl font-black tracking-tight">Student Portal</h1>
            </div>
            <p className="text-blue-100 font-medium">គ្រប់គ្រងទិន្នន័យសិស្សក្នុងប្រព័ន្ធ PostgreSQL</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-xl px-8 py-4 rounded-[2rem] border border-white/20 shadow-2xl flex items-center gap-4 transition-transform hover:scale-105">
            <div className="bg-white p-2 rounded-full shadow-inner">
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <span className="block text-white text-2xl font-black leading-none">{students.length}</span>
              <span className="text-blue-100 text-xs font-bold uppercase tracking-widest">សិស្សសរុប</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Side: Form (Sticky) */}
          <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border border-white sticky top-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="bg-blue-50 p-3 rounded-2xl">
                  <UserPlus className="text-blue-600" size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-800">ចុះឈ្មោះសិស្ស</h2>
                  <p className="text-slate-400 text-sm">បំពេញព័ត៌មានខាងក្រោម</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1 uppercase tracking-wider">ឈ្មោះពេញ</label>
                  <input
                    type="text" name="name" value={formData.name} onChange={handleChange}
                    className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-700 font-semibold"
                    placeholder="ឧ. សុខ ជា" required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 ml-1 uppercase tracking-wider">អាយុ</label>
                    <input
                      type="number" name="age" value={formData.age} onChange={handleChange}
                      className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-700 font-semibold"
                      placeholder="18" required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 ml-1 uppercase tracking-wider">ថ្នាក់ទី</label>
                    <input
                      type="text" name="grade" value={formData.grade} onChange={handleChange}
                      className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-700 font-semibold"
                      placeholder="12A" required
                    />
                  </div>
                </div>

                <button
                  type="submit" disabled={loading}
                  className="group w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-blue-600 active:scale-95 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 overflow-hidden relative"
                >
                  <PlusCircle size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                  <span className="relative z-10">{loading ? "កំពុងរក្សាទុក..." : "រក្សាទុកទិន្នន័យ"}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Side: Table/List */}
          <div className="lg:col-span-8">
            <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-xl border border-white overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white/50">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                    <h3 className="text-2xl font-black text-slate-800">បញ្ជីឈ្មោះសិស្ស</h3>
                </div>
                <div className="hidden md:flex bg-slate-100 p-2 rounded-xl items-center gap-2 px-4 border border-slate-200">
                  <Search size={18} className="text-slate-400" />
                  <input type="text" placeholder="ស្វែងរក..." className="bg-transparent outline-none text-sm font-medium w-32" />
                </div>
              </div>
              
              <div className="overflow-x-auto px-4 pb-4">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">
                      <th className="p-6">ព័ត៌មានសិស្ស</th>
                      <th className="p-6 text-center">អាយុ</th>
                      <th className="p-6 text-center">ថ្នាក់</th>
                      <th className="p-6 text-right">សកម្មភាព</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {students.map((st) => (
                      <tr key={st.id} className="hover:bg-blue-50/50 transition-all group">
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-200 ring-4 ring-white">
                              {st.name.charAt(0)}
                            </div>
                            <span className="font-bold text-slate-700 text-lg">{st.name}</span>
                          </div>
                        </td>
                        <td className="p-6 text-center">
                          <span className="font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-lg text-sm">{st.age}</span>
                        </td>
                        <td className="p-6 text-center">
                          <span className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-black ring-1 ring-blue-100">
                            {st.grade}
                          </span>
                        </td>
                        <td className="p-6 text-right">
                          <button 
                            onClick={() => deleteStudent(st.id)}
                            className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-75"
                          >
                            <Trash2 size={22} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {students.length === 0 && (
                  <div className="py-32 text-center">
                    <div className="bg-slate-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-200 shadow-inner">
                      <Users size={48} />
                    </div>
                    <h4 className="text-xl font-bold text-slate-400">មិនទាន់មានទិន្នន័យ</h4>
                    <p className="text-slate-300 text-sm">សូមបញ្ចូលឈ្មោះសិស្សថ្មីនៅផ្នែកខាងឆ្វេង</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;