import { EventEmitter, Injectable } from '@angular/core';
import { NavigationModel } from '../../../navigation.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class FuseNavigationService
{
    onNavCollapseToggle = new EventEmitter<any>();
    onNavCollapseToggled = new EventEmitter<any>();
    onNavigationModelChange: BehaviorSubject<any> = new BehaviorSubject({});
    navigationModel: NavigationModel;
    flatNavigation: any[] = [];

    constructor()
    {
            this.navigationModel = new NavigationModel();
            this.onNavigationModelChange.next(this.navigationModel.model);
        
    }

    removeMenu(id : any)
    {

        if ( this.navigationModel.model.length <= 0 )
        {
            return this.navigationModel.model;
        }

        // Iterate through the given navigation
        for ( const navItem of this.navigationModel.model )
        {
            //console.log(this.navigationModel.model.indexOf(navItem))
            // If the nav item id equals the first location...
            if ( navItem.id === id )
            {
                //console.log(id)
                let index = this.navigationModel.model.indexOf(navItem)
                
                // If there is more location to look at...
                //if ( location.length > 1 )
                {
                    // Remove the first item of the location
                    this.navigationModel.model.splice(index, 1);

                    // Go nested...
                }
            }
        }
    }
    /**
     * Get navigation model
     *
     * @returns {any[]}
     */
    getNavigationModel()
    {
        return this.navigationModel.model;
    }

    /**
     * Set the navigation model
     *
     * @param model
     */
    setNavigationModel(model)
    {
        this.navigationModel = model;
        this.onNavigationModelChange.next(this.navigationModel.model);
    }

    /**
     * Add new navigation item
     * to the given location
     */
    addNavigationItem(location, item)
    {
        // Parse the location
        const locationArr = location.split('.');

        if ( locationArr.length === 0 )
        {
            return;
        }

        // Find the navigation item
        const navItem = this.findNavigationItemById(locationArr);

        //console.log(navItem)

        // Act according to the item type
        switch ( navItem.type )
        {
            case 'item':

                // Create a children array
                navItem.children = [];

                // Push the item
                navItem.children.push(item);

                // Change the item type to collapsable
                navItem.type = 'collapse';

                break;

            case 'collapse':

                // Push the item
                navItem.children.push(item);

                break;

            case 'group':

                // Push the item
                navItem.children.push(item);

                break;

            default:
                break;
        }
    }

    /**
     * Get navigation item from
     * given location
     *
     * @param location
     */
    getNavigationItem(location)
    {
        // Parse the location
        const locationArr = location.split('.');

        if ( locationArr.length === 0 )
        {
            return;
        }

        // Find and return the navigation item
        return this.findNavigationItemById(locationArr);
    }

    /**
     * Find navigation item by location
     *
     * @param location
     * @param navigation
     */
    findNavigationItemById(location, navigation?)
    {
        if ( !navigation )
        {
            navigation = this.navigationModel.model;
        }

        // Iterate through the given navigation
        for ( const navItem of navigation )
        {
            // If the nav item id equals the first location...
            if ( navItem.id === location[0] )
            {
                // If there is more location to look at...
                if ( location.length > 1 )
                {
                    // Remove the first item of the location
                    location.splice(0, 1);

                    // Go nested...
                    return this.findNavigationItemById(location, navItem.children);
                }

                // Otherwise just return the nav item
                else
                {
                    return navItem;
                }
            }
        }
    }
    findNavigationItemByURL(url, navigation?)
    {
        if ( !navigation )
        {
            navigation = this.navigationModel.model;
        }

        // Iterate through the given navigation
        for ( const navItem of navigation )
        {
            // If the nav item id equals the first location...
            if( navItem.type == "item")
            {
                if ( navItem.url === url )
                {
                    return navItem;
                }
            }
            else if( navItem.type == "collapse")
            {
                return this.findNavigationItemByURL(url, navItem.children);
            }
        }
        return null;
    }

    /**
     * Get flattened navigation array
     * @param navigationItems
     * @returns {any[]}
     */
    getFlatNavigation(navigationItems?)
    {
        //console.log(navigationItems)
        if ( !navigationItems )
        {
            navigationItems = this.navigationModel.model;
        }

        for ( const navItem of navigationItems )
        {
            if ( navItem.type === 'subheader' )
            {
                continue;
            }

            if ( navItem.type === 'item' )
            {
                this.flatNavigation.push({
                    title: navItem.title,
                    type : navItem.type,
                    icon : navItem.icon || false,
                    url  : navItem.url
                });

                continue;
            }

            if ( navItem.type === 'collapse' || navItem.type === 'group' )
            {
                this.getFlatNavigation(navItem.children);
            }
        }

        return this.flatNavigation;
    }
}
