/**
 * MainLayout.jsx — Shell layout for all public portfolio pages.
 *
 * WHAT: Renders the persistent Navbar at the top and Footer at the bottom,
 *       with the page content (via <Outlet />) in between.
 *
 * HOW:  Uses React Router's <Outlet /> to inject the matched child route.
 *       AnimatePresence + motion.div provide page-transition animations.
 *
 * WHY:  Single layout component means Navbar/Footer are rendered once,
 *       not duplicated across every page file.
 */
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";

const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25, ease: "easeIn" } },
};

export default function MainLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-void flex flex-col noise-bg">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex-1"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
}
