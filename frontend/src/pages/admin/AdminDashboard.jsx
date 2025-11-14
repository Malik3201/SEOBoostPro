import { useNavigate } from 'react-router-dom';
import { ReportIcon, UsersIcon, DashboardIcon, ArrowRightIcon, ClipboardIcon, SettingsIcon } from '../../components/icons';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'View All Reports',
      description: 'Browse and manage all SEO audit reports',
      icon: ReportIcon,
      path: '/admin/reports',
      color: 'from-blue-600 to-indigo-600',
    },
    {
      title: 'Admin List',
      description: 'View all registered administrators',
      icon: UsersIcon,
      path: '/admin/list',
      color: 'from-indigo-600 to-purple-600',
    },
    {
      title: 'Service Contracts',
      description: 'Monitor and update SEO boost engagements',
      icon: ClipboardIcon,
      path: '/admin/contracts',
      color: 'from-cyan-600 to-blue-600',
    },
    {
      title: 'Platform Settings',
      description: 'Manage WhatsApp contact and communication',
      icon: SettingsIcon,
      path: '/admin/settings',
      color: 'from-slate-700 to-slate-900',
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
              <DashboardIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">Admin Dashboard</h1>
              <p className="text-gray-400">Manage your SEO audit platform</p>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <div
                key={idx}
                onClick={() => navigate(card.path)}
                className="glass-effect p-8 cursor-pointer hover:scale-105 transition-all duration-300 animate-fade-in group"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className={`w-16 h-16 mb-6 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center shadow-lg`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-white">{card.title}</h2>
                <p className="text-gray-400 mb-6">{card.description}</p>
                <div className="flex items-center text-blue-400 font-semibold group-hover:text-blue-300 transition-colors">
                  <span>Open</span>
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


