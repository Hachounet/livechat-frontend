import PropTypes from 'prop-types';

export default function Layout({ children }) {
  return (
    <div className=" min-w-[100vw] min-h-[100vh] custom-bg-gradient flex items-center">
      {children}
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
