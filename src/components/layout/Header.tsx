import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  GraduationCap, 
  Menu, 
  ChevronDown,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  LogIn,
  BrainCircuit
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const features = [
  { title: "مركز التعلم الذكي", description: "معامل محاكاة ومعلم ذكي وتقييم BTEC", href: "/learning-center", icon: BrainCircuit },
  { title: "للطلاب", description: "تعلم تفاعلي ومساعد ذكي", href: "/students", icon: GraduationCap },
  { title: "للمعلمين", description: "أدوات تدريس متقدمة", href: "/teachers", icon: BookOpen },
  { title: "للإدارة", description: "تحليلات وتقارير شاملة", href: "/admin", icon: BarChart3 },
  { title: "لأولياء الأمور", description: "متابعة مستمرة", href: "/parents", icon: Users },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg group-hover:shadow-xl transition-all duration-300">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground">BETC</span>
            <span className="text-xs text-muted-foreground">التعليم الذكي</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">
                  المميزات
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    {features.map((feature) => (
                      <li key={feature.title}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={feature.href}
                            className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="flex items-center gap-2">
                              <feature.icon className="h-4 w-4 text-primary" />
                              <div className="text-sm font-medium leading-none">{feature.title}</div>
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {feature.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/learning-center" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 transition-colors">
                  <BrainCircuit className="h-3.5 w-3.5" />
                  <span>مركز التعلم الذكي</span>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/about" className="flex items-center px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
                  عن المنصة
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/pricing" className="flex items-center px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
                  الأسعار
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/contact" className="flex items-center px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
                  تواصل معنا
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">
              <LogIn className="ml-2 h-4 w-4" />
              تسجيل الدخول
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/register">ابدأ مجاناً</Link>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <div className="flex flex-col gap-6 mt-8">
              <Link to="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <span className="text-lg font-bold">BETC</span>
              </Link>
              
              <nav className="flex flex-col gap-2">
                {features.map((feature) => (
                  <Link
                    key={feature.title}
                    to={feature.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground/80 hover:bg-accent hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <feature.icon className="h-5 w-5 text-primary" />
                    <span>{feature.title}</span>
                  </Link>
                ))}
              </nav>

              <div className="flex flex-col gap-3 mt-4">
                <Button variant="outline" asChild>
                  <Link to="/login" onClick={() => setIsOpen(false)}>تسجيل الدخول</Link>
                </Button>
                <Button asChild>
                  <Link to="/register" onClick={() => setIsOpen(false)}>ابدأ مجاناً</Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
