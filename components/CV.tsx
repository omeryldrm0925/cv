
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { User } from '@supabase/supabase-js';
import { logout, updateCv } from '@/app/(auth)/actions';
import Link from 'next/link';

type CVData = {
    name: string;
    title: string;
    summary: string;
    photo: string;
    contactInfo: any[];
    experience: any[];
    volunteerExperience: any[];
    skills: any[];
    education: any[];
    interests: any[];
    languages: any[];
    references: any[];
};

const themes = [
    { id: 'default', name: 'Mor', gradient: 'linear-gradient(90deg, #8A2BE2 0%, #4169E1 50%, #00BFFF 100%)' },
    { id: 'orange', name: 'Turuncu', gradient: 'linear-gradient(90deg, #FF8C00 0%, #FFA500 50%, #FFD700 100%)' },
    { id: 'beige', name: 'Bej', gradient: 'linear-gradient(90deg, #D2B48C 0%, #F5DEB3 50%, #FFF8DC 100%)' },
    { id: 'pink', name: 'Pembe', gradient: 'linear-gradient(90deg, #FF69B4 0%, #FFC0CB 50%, #FFE4E1 100%)' },
    { id: 'dark', name: 'Siyah' },
    { id: 'light', name: 'Beyaz' },
];

const faIcons = [ 'fa-solid fa-star', 'fa-solid fa-award', 'fa-solid fa-anchor', 'fa-solid fa-rocket', 'fa-solid fa-code', 'fa-solid fa-database', 'fa-solid fa-server', 'fa-solid fa-cloud', 'fa-solid fa-mobile-screen', 'fa-solid fa-palette', 'fa-solid fa-pen-ruler', 'fa-solid fa-users', 'fa-solid fa-comments', 'fa-solid fa-chart-line', 'fa-solid fa-chart-pie', 'fa-solid fa-bullseye', 'fa-solid fa-lightbulb', 'fa-solid fa-gears', 'fa-solid fa-briefcase', 'fa-solid fa-graduation-cap', 'fa-solid fa-book', 'fa-solid fa-gamepad', 'fa-solid fa-futbol', 'fa-solid fa-film', 'fa-solid fa-dumbbell', 'fa-solid fa-person-swimming', 'fa-solid fa-camera-retro', 'fa-solid fa-campground', 'fa-brands fa-react', 'fa-brands fa-js', 'fa-brands fa-html5', 'fa-brands fa-css3-alt', 'fa-brands fa-python', 'fa-brands fa-java', 'fa-brands fa-git-alt', 'fa-brands fa-docker', 'fa-brands fa-figma' ];
const languageLevels = ['Beginner', 'Elementary', 'Intermediate', 'Upper-Intermediate', 'Advanced', 'Fluent', 'Native'];

const formatDate = (dateStr: string) => dateStr ? new Date(dateStr).toLocaleDateString('en-CA', { year: 'numeric', month: 'long' }) : '';
const renderDates = (item: any) => {
    const start = formatDate(item.startDate);
    const end = item.ongoing ? 'Ongoing' : formatDate(item.endDate);
    if (!start && !end) return '';
    return `${start} - ${end}`;
}

const LandingPage = ({ cvData, onDataChange, isEditing, onToggleEdit, isAdmin }: { cvData: CVData, onDataChange: (data: Partial<CVData>) => void, isEditing: boolean, onToggleEdit: () => void, isAdmin: boolean }) => {
    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onDataChange({ [e.target.name]: e.target.value });
    };

    return (
      <section className="landing-page">
        <div className="landing-content">
          <div className="local-edit-toggle-wrapper">
            <img src={cvData.photo} alt="Profil Fotoğrafı" className="profile-photo" />
          </div>
          <div className="landing-text-content">
            <div className="name-container">
              {isEditing && isAdmin ? (
                <input type="text" name="name" className="editable-field" value={cvData.name} onChange={handleInput} />
              ) : (
                <h1>{cvData.name}</h1>
              )}
               {isAdmin && (
                 <button className={`local-edit-toggle ${isEditing ? 'active' : ''}`} onClick={onToggleEdit} aria-label="Düzenle">
                    <i className="fa-solid fa-pencil"></i>
                </button>
               )}
            </div>
             {isEditing && isAdmin ? (
                <>
                    <input type="text" name="title" className="editable-field small" value={cvData.title} onChange={handleInput} placeholder="Unvanınız" />
                    <textarea name="summary" className="editable-field small" onChange={handleInput} placeholder="Kısa özetiniz...">{cvData.summary}</textarea>
                </>
             ) : (
                <>
                    <h2>{cvData.title}</h2>
                    <p className="summary">{cvData.summary}</p>
                </>
             )}
          </div>
        </div>
      </section>
    );
};

const MainMenu = ({ onSectionClick }: { onSectionClick: (id: string) => void }) => {
    const menuItems = [
        { id: 'experience', label: 'Work Experiences', icon: 'fa-solid fa-briefcase' },
        { id: 'volunteerExperience', label: 'Volunteer Experiences', icon: 'fa-solid fa-hands-helping' },
        { id: 'education', label: 'Education', icon: 'fa-solid fa-graduation-cap' },
        { id: 'skills', label: 'Skills', icon: 'fa-solid fa-gears' },
        { id: 'interests', label: 'Interests', icon: 'fa-solid fa-heart' },
        { id: 'languages', label: 'Languages', icon: 'fa-solid fa-language' },
        { id: 'references', label: 'References', icon: 'fa-solid fa-users' },
        { id: 'contactInfo', label: 'Contact', icon: 'fa-solid fa-envelope' }
    ];

    return (
      <section className="main-menu">
        <div className="menu-grid">
          {menuItems.map(item => (
            <button className="menu-item" key={item.id} onClick={() => onSectionClick(item.id)}>
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </section>
    );
};

const AddOrEditItemModal = ({ sectionId, item, onSave, onClose }: { sectionId: string, item: any, onSave: (sectionId: string, item: any) => void, onClose: () => void }) => {
    const isNew = !item || !item.id;
    const [formData, setFormData] = useState(isNew ? { description: [] } : { ...item });
    const [descType, setDescType] = useState(isNew || Array.isArray(item?.description) ? 'list' : 'paragraph');
    const [newListItemText, setNewListItemText] = useState('');

    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);
    
    useEffect(() => {
        if (typeof formData.description === 'string' && descType === 'list') {
            setFormData(prev => ({ ...prev, description: [prev.description].filter(Boolean)}));
        }
    }, [formData.description, descType]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleStarRating = (level: number) => setFormData(prev => ({ ...prev, level }));
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(sectionId, formData);
        onClose();
    };
    
    const handleAddListItem = () => {
        if (newListItemText.trim() === '') return;
        setFormData(prev => ({ ...prev, description: [...(prev.description || []), newListItemText] }));
        setNewListItemText('');
    };

    const handleListItemKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddListItem();
        }
    };

    const handleDeleteListItem = (indexToDelete: number) => {
        setFormData(prev => ({ ...prev, description: (prev.description || []).filter((_: any, index: number) => index !== indexToDelete) }));
    };
    
    const handleDragStart = (e: React.DragEvent<HTMLLIElement>, position: number) => {
        dragItem.current = position;
        e.currentTarget.classList.add('dragging');
    };

    const handleDragEnter = (e: React.DragEvent<HTMLLIElement>, position: number) => {
        dragOverItem.current = position;
    };

    const handleDrop = (e: React.DragEvent<HTMLLIElement>) => {
        e.currentTarget.classList.remove('dragging');
        if (dragItem.current === null || dragOverItem.current === null) return;

        const newList = [...formData.description];
        const dragItemContent = newList[dragItem.current];
        newList.splice(dragItem.current, 1);
        newList.splice(dragOverItem.current, 0, dragItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        setFormData(prev => ({ ...prev, description: newList }));
    };

    const renderFormFields = () => {
        switch (sectionId) {
            case 'experience':
            case 'volunteerExperience':
            case 'education':
                const titleLabel = sectionId === 'education' ? 'Degree/Program' : 'Title';
                const companyLabel = sectionId === 'education' ? 'School/University' : 'Company';
                return <>
                    <div className="form-group"><label>{titleLabel}</label><input type="text" name={sectionId === 'education' ? 'degree' : 'title'} value={formData.degree || formData.title || ''} onChange={handleInput} /></div>
                    <div className="form-group"><label>{companyLabel}</label><input type="text" name={sectionId === 'education' ? 'school' : 'company'} value={formData.school || formData.company || ''} onChange={handleInput} /></div>
                    <div className="form-group date-group">
                        <label>Date Range</label>
                        <input type="date" name="startDate" value={formData.startDate || ''} onChange={handleInput} />
                        <input type="date" name="endDate" value={formData.endDate || ''} onChange={handleInput} disabled={formData.ongoing} />
                        <label className="checkbox-label"><input type="checkbox" name="ongoing" checked={formData.ongoing || false} onChange={handleInput}/> Ongoing</label>
                    </div>
                     <div className="form-group">
                        <label>Description</label>
                        <div className="description-toggle">
                            <button type="button" className={descType === 'list' ? 'active' : ''} onClick={() => setDescType('list')}>List</button>
                            <button type="button" className={descType === 'paragraph' ? 'active' : ''} onClick={() => setDescType('paragraph')}>Paragraph</button>
                        </div>
                        {descType === 'list' ? (
                            <div className="description-list-editor">
                                <div className="list-input-group">
                                    <input type="text" placeholder="Describe your experiences in bullet points!" value={newListItemText} onChange={e => setNewListItemText((e.target as HTMLInputElement).value)} onKeyDown={handleListItemKeyDown}/>
                                    <button type="button" className="btn-add-item" onClick={handleAddListItem}>Add</button>
                                </div>
                                <ul className="draggable-list">
                                    {(formData.description || []).map((listItem: string, index: number) => (
                                        <li 
                                            key={index} 
                                            className="draggable-item"
                                            draggable="true"
                                            onDragStart={e => handleDragStart(e, index)}
                                            onDragEnter={e => handleDragEnter(e, index)}
                                            onDragEnd={handleDrop}
                                            onDragOver={e => e.preventDefault()}
                                        >
                                            <i className="fa-solid fa-grip-vertical drag-handle"></i>
                                            <span>{listItem}</span>
                                            <button type="button" className="delete-list-item" onClick={() => handleDeleteListItem(index)} aria-label="Delete item"><i className="fa-solid fa-xmark"></i></button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <textarea 
                                name="description" 
                                value={(Array.isArray(formData.description) ? formData.description.join('\\n') : formData.description) || ''} 
                                onChange={e => setFormData(prev => ({...prev, description: (e.target as HTMLTextAreaElement).value}))} 
                                placeholder="Enter a single paragraph.">
                            </textarea>
                        )}
                    </div>
                </>;
            case 'skills':
                return <>
                    <div className="form-group"><label>Skill Name</label><input type="text" name="name" value={formData.name || ''} onChange={handleInput} /></div>
                    <div className="form-group"><label>Icon</label><IconPicker selected={formData.icon} onChange={(icon) => handleInput({ target: { name: 'icon', value: icon } } as any)} /></div>
                    <div className="form-group"><label>Level</label><StarRating level={formData.level || 0} onRate={handleStarRating} isInteractive={true} /></div>
                </>;
            case 'interests':
                 return <>
                    <div className="form-group"><label>Interest Name</label><input type="text" name="name" value={formData.name || ''} onChange={handleInput} /></div>
                    <div className="form-group"><label>Icon</label><IconPicker selected={formData.icon} onChange={(icon) => handleInput({ target: { name: 'icon', value: icon } } as any)} /></div>
                </>;
            case 'languages':
                return <>
                    <div className="form-group"><label>Language</label><input type="text" name="name" value={formData.name || ''} onChange={handleInput} /></div>
                    <div className="form-group"><label>Level</label><select name="level" value={formData.level || 'Beginner'} onChange={handleInput}>{languageLevels.map(l => <option value={l} key={l}>{l}</option>)}</select></div>
                </>;
            case 'references':
                return <>
                    <div className="form-group"><label>Name</label><input type="text" name="name" value={formData.name || ''} onChange={handleInput} /></div>
                    <div className="form-group"><label>Title</label><input type="text" name="title" value={formData.title || ''} onChange={handleInput} /></div>
                    <div className="form-group"><label>Email</label><input type="email" name="email" value={formData.email || ''} onChange={handleInput} /></div>
                    <div className="form-group"><label>Phone</label><input type="tel" name="phone" value={formData.phone || ''} onChange={handleInput} /></div>
                </>;
            case 'contactInfo':
                return <>
                    <div className="form-group"><label>Type (e.g., Email, LinkedIn)</label><input type="text" name="type" value={formData.type || ''} onChange={handleInput} /></div>
                    <div className="form-group"><label>Value (e.g., your@email.com)</label><input type="text" name="value" value={formData.value || ''} onChange={handleInput} /></div>
                    <div className="form-group"><label>Icon</label><IconPicker selected={formData.icon} onChange={(icon) => handleInput({ target: { name: 'icon', value: icon } } as any)} /></div>
                </>;
            default: return null;
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content form-modal" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Kapat"><i className="fa-solid fa-xmark"></i></button>
                <h2>{isNew ? 'Add New Item' : 'Edit Item'}</h2>
                <form className="modal-body" onSubmit={handleSubmit}>
                    {renderFormFields()}
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const IconPicker = ({ selected, onChange }: { selected: string, onChange: (icon: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const pickerRef = useCallback((node: HTMLDivElement) => {
        if (node) {
            const handleClickOutside = (event: MouseEvent) => {
                if (node && !node.contains(event.target as Node)) {
                    setIsOpen(false);
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);

    const handleSelect = (iconClass: string) => {
        onChange(iconClass);
        setIsOpen(false);
    };

    const formatIconName = (iconClass: string) => iconClass.replace(/fa-(solid|brands) fa-/, '').replace(/-/g, ' ');

    return (
        <div className="icon-picker" ref={pickerRef}>
            <button type="button" className="icon-picker-button" onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen}>
                <span className="icon-picker-selected-value">
                    {selected ? <><i className={selected}></i> <span>{formatIconName(selected)}</span></> : 'Select an icon...'}
                </span>
                <i className="fa-solid fa-chevron-down"></i>
            </button>
            {isOpen && (
                <div className="icon-picker-panel">
                    {faIcons.map(iconClass => (
                        <button type="button" key={iconClass} className="icon-picker-option" onClick={() => handleSelect(iconClass)} title={formatIconName(iconClass)}>
                            <i className={iconClass}></i>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const StarRating = ({ level, onRate, isInteractive }: { level: number, onRate?: (level: number) => void, isInteractive: boolean }) => {
    return (
        <div className={`star-rating ${isInteractive ? 'interactive' : ''}`}>
            {[1, 2, 3, 4, 5].map(star => (
                <i 
                    key={star}
                    className={`${star <= level ? 'fa-solid' : 'fa-regular'} fa-star`} 
                    onClick={isInteractive && onRate ? () => onRate(star) : undefined}
                ></i>
            ))}
        </div>
    );
};

const SectionModal = ({ section, data, onClose, onAddItem, onEditItem, onDeleteItem, isAdmin }: { section: any, data: CVData, onClose: () => void, onAddItem: (id: string) => void, onEditItem: (id: string, item: any) => void, onDeleteItem: (id: string, itemId: number) => void, isAdmin: boolean }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
           if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    useEffect(() => { setCurrentIndex(0); }, [section]);

    if (!section) return null;

    let content;
    const sliderSections = ['experience', 'volunteerExperience', 'education'];
    const listSections = ['skills', 'interests', 'languages', 'references', 'contactInfo'];
    const items = data[section.id as keyof CVData] as any[] || [];

    const renderItemControls = (item: any) => (
        <div className="item-controls">
            <button onClick={() => onEditItem(section.id, item)} aria-label="Edit item"><i className="fa-solid fa-pen"></i></button>
            <button onClick={() => onDeleteItem(section.id, item.id)} aria-label="Delete item"><i className="fa-solid fa-trash"></i></button>
        </div>
    );
    
    if (sliderSections.includes(section.id)) {
        const currentItem = items[currentIndex];
        const next = () => setCurrentIndex(prev => (prev + 1) % items.length);
        const prev = () => setCurrentIndex(prev => (prev - 1 + items.length) % items.length);

        content = !currentItem ? <p className="empty-state">No items to display.</p> : (
            <div className="slider-container">
                {isAdmin && <div className="item-controls-slider">{renderItemControls(currentItem)}</div>}
                <div className="slider-card">
                    {section.id === 'education' ? (
                        <>
                            <h3>{currentItem.school}</h3>
                            <h4>{currentItem.degree}</h4>
                            <p className="item-dates">{renderDates(currentItem)}</p>
                        </>
                     ) : (
                        <>
                            <h3>{currentItem.company}</h3>
                            <h4>{currentItem.title}</h4>
                            <p className="item-dates">{renderDates(currentItem)}</p>
                            {Array.isArray(currentItem.description) && currentItem.description.length > 0 && 
                                <ul>{currentItem.description.map((d: string, i: number) => <li key={i}>{d}</li>)}</ul>
                            }
                        </>
                    )}
                </div>
                {items.length > 1 && (
                    <div className="slider-nav">
                        <button className="slider-nav-btn" onClick={prev} aria-label="Previous"><i className="fa-solid fa-chevron-left"></i></button>
                        <span className="slider-counter">{currentIndex + 1} / {items.length}</span>
                        <button className="slider-nav-btn" onClick={next} aria-label="Next"><i className="fa-solid fa-chevron-right"></i></button>
                    </div>
                )}
            </div>
        );
    } else if (listSections.includes(section.id)) {
        content = (
            <ul className={`icon-list ${section.id === 'references' || section.id === 'contactInfo' ? 'detailed-list' : ''}`}>
                {items.length === 0 && <p className="empty-state">No items to display.</p>}
                {items.map(item => (
                    <li className="icon-list-item" key={item.id}>
                        <i className={item.icon || 'fa-solid fa-star'}></i>
                        <div className="item-content">
                            {section.id === 'skills' && <><span>{item.name}</span> <StarRating level={item.level} isInteractive={false} /></>}
                            {section.id === 'interests' && <span>{item.name}</span>}
                            {section.id === 'languages' && <span><strong>{item.name}:</strong> {item.level}</span>}
                            {section.id === 'references' && (
                                <div>
                                    <h3>{item.name}</h3>
                                    <h4>{item.title}</h4>
                                    <p><a href={`mailto:${item.email}`}>{item.email}</a></p>
                                    <p><a href={`tel:${item.phone?.replace(/ /g, '')}`}>{item.phone}</a></p>
                                </div>
                            )}
                            {section.id === 'contactInfo' && (
                                <div>
                                  <h3>{item.type}</h3>
                                  <a href={`${(item.type === 'email' ? 'mailto:' : (item.type === 'phone' ? 'tel:' : ''))}${item.value}`} target="_blank" rel="noopener noreferrer">{item.value}</a>
                                </div>
                            )}
                        </div>
                        {isAdmin && renderItemControls(item)}
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                 <div className="modal-header">
                    <h2>{section.label}</h2>
                    {isAdmin && <button className="add-item-btn" onClick={() => onAddItem(section.id)}><i className="fa-solid fa-plus"></i> Add New</button>}
                 </div>
                 <button className="modal-close" onClick={onClose} aria-label="Kapat"><i className="fa-solid fa-xmark"></i></button>
                <div className="modal-body">
                    {content}
                </div>
            </div>
        </div>
    );
}

const Notification = ({ message, onClear }: { message: string, onClear: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(onClear, 3000);
        return () => clearTimeout(timer);
    }, [message, onClear]);

    return <div className="notification">{message}</div>;
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, message: string }) => {
    if (!isOpen) return null;

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
           if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content confirmation-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-body">
                    <p>{message}</p>
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="button" className="btn-danger" onClick={onConfirm}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function CV({ initialData, user }: { initialData: CVData, user: User | null }) {
    const [cvData, setCvData] = useState(initialData);
    const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
    const [isLandingPageEditing, setIsLandingPageEditing] = useState(false);
    const [activeTheme, setActiveTheme] = useState('default');
    const [showThemePalette, setShowThemePalette] = useState(false);
    const [notification, setNotification] = useState('');
    const [editModalState, setEditModalState] = useState({ isOpen: false, sectionId: null as string | null, item: null as any | null });
    const [confirmationState, setConfirmationState] = useState({ isOpen: false, message: '', onConfirm: () => {} });
    
    const isAdmin = !!user;

    // This effect ensures that if the user logs in/out, the cvData state is updated
    // with the new data coming from the server.
    useEffect(() => {
        setCvData(initialData);
    }, [initialData]);

    useEffect(() => {
        document.body.className = `theme-${activeTheme}`;
    }, [activeTheme]);
    
    const saveData = async (dataToSave: CVData) => {
        try {
            await updateCv(dataToSave);
            setNotification('Changes saved successfully!');
        } catch (error) {
            setNotification('Error: Could not save changes.');
            console.error(error);
        }
    };

    const handleCVDataChange = (newData: Partial<CVData>) => {
        const nextCvData = { ...cvData, ...newData };
        setCvData(nextCvData);
        saveData(nextCvData);
    };

    const handleSectionClick = (id: string) => setActiveSectionId(id);

    const toggleLandingPageEdit = () => setIsLandingPageEditing(!isLandingPageEditing);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setNotification('Link copied to clipboard!');
        });
    };
    
    const handleLogout = async () => {
        await logout();
        setIsLandingPageEditing(false); // Turn off editing mode on logout
        setNotification('Logged out.');
    };

    const handleAddItem = (sectionId: string) => {
        setEditModalState({ isOpen: true, sectionId: sectionId, item: null });
    };

    const handleEditItem = (sectionId: string, item: any) => {
        setEditModalState({ isOpen: true, sectionId: sectionId, item: item });
    };

    const handleDeleteItem = (sectionId: string, itemId: number) => {
        setConfirmationState({
            isOpen: true,
            message: 'Are you sure you want to delete this item? This action cannot be undone.',
            onConfirm: () => {
                const sectionItems = cvData[sectionId as keyof CVData] as any[];
                const nextCvData = {
                    ...cvData,
                    [sectionId]: sectionItems.filter(item => item.id !== itemId)
                };
                setCvData(nextCvData);
                saveData(nextCvData);
                setConfirmationState({ isOpen: false, message: '', onConfirm: () => {} });
            }
        });
    };

    const handleSaveItem = (sectionId: string, itemToSave: any) => {
        const sectionData = cvData[sectionId as keyof CVData] as any[];
        const isNew = !itemToSave.id;
        let newSectionData;
        if (isNew) {
            const newItem = { ...itemToSave, id: Date.now() };
            newSectionData = [...sectionData, newItem];
        } else {
            newSectionData = sectionData.map(item => item.id === itemToSave.id ? itemToSave : item);
        }
        const nextCvData = { ...cvData, [sectionId]: newSectionData };
        setCvData(nextCvData);
        saveData(nextCvData);
    };

    const menuItems = [
        { id: 'experience', label: 'Work Experiences' }, { id: 'volunteerExperience', label: 'Volunteer Experiences' },
        { id: 'education', label: 'Education' }, { id: 'skills', label: 'Skills' },
        { id: 'interests', label: 'Interests' }, { id: 'languages', label: 'Languages' },
        { id: 'references', label: 'References' }, { id: 'contactInfo', label: 'Contact' }
    ];

    const activeSection = activeSectionId ? menuItems.find(item => item.id === activeSectionId) : null;
    
    return (
        <div className="app-container">
            <div className="top-right-controls">
                {isAdmin ? (
                     <button className="control-btn" onClick={handleLogout} aria-label="Çıkış Yap"><i className="fa-solid fa-right-from-bracket"></i></button>
                ) : (
                    <Link href="/login" className="control-btn" aria-label="Giriş Yap">
                        <i className="fa-solid fa-right-to-bracket"></i>
                    </Link>
                )}
                <button className="control-btn" onClick={handleShare} aria-label="Paylaş"><i className="fa-solid fa-arrow-up-from-bracket"></i></button>
                <div className="theme-palette-container">
                    <button className="control-btn" onClick={() => setShowThemePalette(!showThemePalette)} aria-label="Tema Seç"><i className="fa-solid fa-palette"></i></button>
                    {showThemePalette && (
                        <div className="theme-palette">
                            {themes.map(theme => (
                                <button key={theme.id} className={`theme-option ${activeTheme === theme.id ? 'active' : ''}`} onClick={() => { setActiveTheme(theme.id); setShowThemePalette(false); }} style={{background: theme.gradient}}>{theme.name}</button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {notification && <Notification message={notification} onClear={() => setNotification('')} />}

            <LandingPage cvData={cvData} onDataChange={handleCVDataChange} isEditing={isLandingPageEditing} onToggleEdit={toggleLandingPageEdit} isAdmin={isAdmin} />
            <MainMenu onSectionClick={handleSectionClick} />
            
            <SectionModal 
                section={activeSection} 
                data={cvData} 
                onClose={() => setActiveSectionId(null)} 
                onAddItem={handleAddItem}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
                isAdmin={isAdmin}
            />
            
            {editModalState.isOpen && isAdmin && <AddOrEditItemModal 
                sectionId={editModalState.sectionId!}
                item={editModalState.item}
                onSave={handleSaveItem}
                onClose={() => setEditModalState({isOpen: false, sectionId: null, item: null})}
            />}

            <ConfirmationModal 
                isOpen={confirmationState.isOpen}
                onClose={() => setConfirmationState({ isOpen: false, message: '', onConfirm: () => {} })}
                onConfirm={confirmationState.onConfirm}
                message={confirmationState.message}
            />
        </div>
    );
};
