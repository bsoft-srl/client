(function () {
    angular
        .module('app')
        .factory('SidecoStore', Factory);

    /**
     *
     */
    Factory.$inject = ['store'];

    function Factory(store) {
        return store.getNamespacedStore('sideco', 'sessionStorage');
    }

})();
