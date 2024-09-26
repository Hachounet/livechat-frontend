import PropTypes from 'prop-types';

export default function Layout({ children }) {
  return (
    <div className="min-h-[100dvh] max-w-[100%]  custom-bg-gradient flex justify-center items-center">
      {children}
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
