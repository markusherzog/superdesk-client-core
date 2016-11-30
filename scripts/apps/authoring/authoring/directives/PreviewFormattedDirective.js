PreviewFormattedDirective.$inject = ['api', 'config', 'notify', 'storage'];
export function PreviewFormattedDirective(api, config, notify, storage) {
    return {
        templateUrl: 'scripts/apps/authoring/views/preview-formatted.html',
        link: function(scope) {
            scope.formatters = config.previewFormats;
            scope.loading = false;
            scope.selectedFormatter = storage.getItem('selectedFormatter') || JSON.stringify(scope.formatters[0]);

            scope.format = function(formatterString) {
                scope.loading = true;
                storage.setItem('selectedFormatter', formatterString);
                var formatter = JSON.parse(formatterString);

                api.save('formatters', {}, {article_id: scope.item._id, formatter_name: formatter.name})
                .then((item) => {
                    if (formatter.outputType === 'json') {
                        scope.formattedItem = JSON.parse(item._id.formatted_doc)[formatter.outputField];
                    }
                }, (error) => {
                    if (angular.isDefined(error.data._message)) {
                        notify.error(gettext(error.data._message));
                    }
                })
                .finally(() => {
                    scope.loading = false;
                });
            };
        }
    };
}
