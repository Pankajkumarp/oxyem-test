import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const non_logged_in_accessible_pages = [
  "/",
  "/login",
  "/home"
];

const logged_in_accessible_pages = [
  "/",
  "/user",
  "/employeeDashboard",
  "/leave",
  "/addleave",
  "/Projectmanagement",
  "/Project-dashboard",
  "/shift-management",
  "/shift-management/create",
  "/userList",
  "/basket-of-allowance",
  "/basket-of-allowance/create",
  "/leave/admin",
  "/addleave/admin",
  "/attendance",
  "/attendance/admin", 
  "/addattendance",
  "/payrollManagement",
  "/Employee",
  "/addPayroll",
  "/Taskbar",
  "/holiday",
  "/holiday/addHoliday",

  "/assetManagement",
  "/addAssets",
  "/allocationManagement",
  "/allocateAssets",
  "/deallocateAssets",
  "/allocateExtend",
  "/employeeAsset",

  "/automation-ideas/add",
  "/automation-ideas/dashboard",
  "/automation-ideas",

  "/admin/add-shift",
  "/admin/shift-dashboard",
  "/admin/allowance-dashboard",
  "/admin/pending-shift",
  "/my-shift",

  "/admin/claim",
  "/admin/claim/pending-list",
  "/admin/claim/add",
  "/claim",
  "/claim/add",

  "/create-group",
  "/groups",
  "/add-permission",
  "/permission-list",
  "/menu-list",
  "/menu",

  "/stock-management/inventory-dashboard",
  "/stock-management/add-product",
  "/stock-management/generate-report",
  "/stock-management/report-dashboard",
  "/stock-management/inventory-dashboard",
  "/stock-management/add-inventory",
  
  "/admin/user-list",  
  "/opportunity",  
  "/createInvoice",
  
  "/initiate-separation",
  "/eSeparation",
  "/eSeparation/admin",
  "/eSeparation/edit",
  "/eSeparation/view",
  "/performance"
  
];

const accessible_for_all_pages = ["/Join-us"];

export function middleware(request: NextRequest) {
  const userToken = request.cookies.get("refreshToken")?.value;
  if (!userToken) {
    const is_non_logged_in_accessible_pages =
      non_logged_in_accessible_pages.find(
        (element) => element === request.nextUrl.pathname
      );

    const is_accessible_for_all_pages = accessible_for_all_pages.find(
      (element) => element === request.nextUrl.pathname
    );

    if (is_non_logged_in_accessible_pages || is_accessible_for_all_pages) {
    } else {
          return NextResponse.redirect(new URL("/login", request.url));

    }
  } else {
    const is_non_logged_in_accessible_pages =
      non_logged_in_accessible_pages.find(
        (element) => element === request.nextUrl.pathname
      );

    if (is_non_logged_in_accessible_pages) {
      return NextResponse.redirect(new URL("/employeeDashboard", request.url));
    }
  }
}


 
export const config = {
  matcher: ['/login/:path*', '/Forgot-password/:path*', '/Dashboard', '/user', '/', '/employeeDashboard', '/employeeDashboard/:path*', '/leave', '/addleave', '/addleave/:path*', '/Projectmanagement', '/Project-dashboard', '/shift-management', '/shift-management/create', '/userList', '/basket-of-allowance', '/basket-of-allowance/create', '/leave/admin', '/addleave/admin', '/attendance', '/attendance/admin', '/addattendance', '/payrollManagement', '/addPayroll', '/Employee', '/Taskbar', '/holiday', '/holiday/addHoliday', '/Project-allocation/:path*' ,'/admin/user-list' ,'/menu' ,'/menu-list' ,'/permission-list','/add-permission' ,'/groups' ,'/create-group' ,'/claim/add' ,'/claim' ,'/admin/claim/add' ,'/admin/claim/pending-list' ,'/admin/claim' ,'/my-shift' ,'/admin/pending-shift' ,'/admin/allowance-dashboard' ,'/admin/shift-dashboard' ,'/admin/add-shift' ,'/automation-ideas' ,'/automation-ideas/dashboard' ,'/automation-ideas/add' ,'/employeeAsset','/allocateExtend', '/deallocateAssets', '/allocateAssets', '/allocationManagement' ,'/addAssets' ,'/assetManagement', '/home', '/opportunity', '/opportunity/:path*', '/createInvoice', '/initiate-separation', '/eSeparation', '/eSeparation/admin', '/eSeparation/edit', '/eSeparation/view', '/performance', '/performance/:path*'],
}
 