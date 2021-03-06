define(['./../module', 'underscore'], function (module, _) {

    module.factory('SideCategoryFactory', function () {
        return {
            Item: function () {
                return {
                    type: 'custom',
                    is_open: true,
                    link: {
                        menu_type: 'opencart',
                        menu_item: {
                            page: 'common/home'
                        }
                    },
                    name: { },
                    new_window: 0,
                    position: 'top',
                    sort_order: ''
                };
            }
        };
    });

    module.controller('SideCategoryFormController', ['$scope', '$routeParams', '$location', 'Rest', 'Spinner', 'SideCategoryFactory', function ($scope, $routeParams, $location, Rest, Spinner, SideCategoryFactory) {
        /* opened modules */
        $scope.module_id = $routeParams.module_id || null;

        /* scope vars */
        $scope.module_type = 'side_category';
        $scope.default_language = Journal2Config.languages.default;

        $scope.module_data = {
            module_name: 'New Side Category',
            type: 'accordion',
            title: {},
            show_categories: 1,
            sections: []
        };

        if ($scope.module_id) {
            Rest.getModule($scope.module_id).then(function (response) {
                $scope.module_data = _.extend($scope.module_data, response.module_data);
                $scope.module_data.sections = _.map($scope.module_data.sections, function (section) {
                    return _.extend(new SideCategoryFactory.Item(), section);
                });
                Spinner.hide();
            }, function (error) {
                Spinner.hide();
                console.error(error);
            });
        } else {
            Spinner.hide();
        }

        /* save data */
        $scope.save = function ($event) {
            var $src = $($event.target || $event.srcElement);
            Spinner.show($src);
            if ($scope.module_id) {
                Rest.editModule($scope.module_id, $scope.module_data).then(function () {
                    Spinner.hide($src);
                }, function (error) {
                    alert(error);
                    Spinner.hide($src);
                });
            } else {
                Rest.addModule($scope.module_type, $scope.module_data).then(function (response) {
                    $location.path('/module/' + $scope.module_type + '/form/' + response.module_id);
                    Spinner.hide($src);
                }, function (error) {
                    alert(error);
                    Spinner.hide($src);
                });
            }
        };

        $scope.delete = function ($event) {
            var $src = $($event.target || $event.srcElement);
            Spinner.show($src);
            if (!confirm('Delete module "' + $scope.module_data.module_name + '"?')) {
                Spinner.hide($src);
                return;
            }
            Rest.deleteModule($scope.module_id).then(function () {
                $location.path('/module/' + $scope.module_type + '/all');
                Spinner.hide($src);
            }, function (error) {
                Spinner.hide($src);
                alert(error);
            });
        };

        $scope.addSection = function () {
            $scope.module_data.sections.push(new SideCategoryFactory.Item());
        };

        $scope.removeSection = function ($index) {
            $scope.module_data.sections.splice($index, 1);
        };

        $scope.duplicateSection = function (index) {
            $scope.module_data.sections.push(angular.copy($scope.module_data.sections[index]));
        };

        $scope.toggleAccordion = function (items, value) {
            _.each(items, function (item) {
                item.is_open = value;
            });
            $scope.module_data.general_is_open = value;
            if (value) {
                $scope.module_data.close_others = false;
            }
        };

    }]);

});